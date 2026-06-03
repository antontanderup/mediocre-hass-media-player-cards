import { useContext } from "preact/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { CardContext, CardContextType } from "@components/CardContext";
import { usePlayer } from "@components/PlayerContext";
import { SelectedPlayerContext } from "@components/SelectedPlayerContext";
import { getHasMassFeatures, getHass } from "@utils";
import { useHassMessagePromise } from "./useHassMessagePromise";
import type { MaFavoriteControl } from "@types";

type MaFavoriteQueueResponse = Record<
  string,
  {
    current_item?: {
      queue_item_id?: string;
      media_item?: {
        favorite?: boolean;
        uri?: string;
      };
    };
  }
>;

type FavoriteAwareCardConfig = {
  ma_entity_id?: string | null;
  ma_favorite_button_entity_id?: string | null;
  ma_favorite_control?: MaFavoriteControl;
};

const ENABLE_BACKGROUND_FAVORITE_POLLING = true;
const FAVORITE_POLL_INTERVAL_MS = 10000;
const CLICK_BUSY_DELAY_MS = 120;

const matchesEntityId = (value: unknown, entityId: string) => {
  if (typeof value === "string") {
    return value === entityId;
  }

  if (Array.isArray(value)) {
    return value.includes(entityId);
  }

  return false;
};

const sleep = (ms: number) =>
  new Promise(resolve => window.setTimeout(resolve, ms));

export const useMaFavoriteControl = () => {
  const player = usePlayer();
  const selectedPlayerContext = useContext(SelectedPlayerContext);
  const { config } = useContext<CardContextType<FavoriteAwareCardConfig>>(
    CardContext
  );

  const selectedPlayer = selectedPlayerContext?.selectedPlayer;
  const maEntityId = selectedPlayer?.ma_entity_id ?? config.ma_entity_id;
  const favoriteButtonEntityId =
    selectedPlayer?.ma_favorite_button_entity_id ??
    config.ma_favorite_button_entity_id;
  const controlConfig =
    selectedPlayer?.ma_favorite_control ?? config.ma_favorite_control;

  const hasMassFeatures = getHasMassFeatures(
    player.entity_id,
    maEntityId ?? undefined
  );
  const enabled =
    controlConfig?.show_on_artwork === true &&
    hasMassFeatures &&
    !!maEntityId &&
    !!favoriteButtonEntityId;

  const queueMessage = useMemo(
    () =>
      enabled
        ? {
            type: "call_service" as const,
            domain: "music_assistant",
            service: "get_queue",
            service_data: {
              entity_id: maEntityId,
            },
            return_response: true,
          }
        : null,
    [enabled, maEntityId]
  );

  const queueQueryOptions = useMemo(
    () => ({
      enabled,
      staleTime: 5000,
    }),
    [enabled]
  );

  const { data, refetch } =
    useHassMessagePromise<MaFavoriteQueueResponse>(
      queueMessage,
      queueQueryOptions
    );

  const currentItem = maEntityId ? data?.[maEntityId]?.current_item : undefined;
  const currentItemUri = currentItem?.media_item?.uri;
  const backendFavorite = currentItem?.media_item?.favorite ?? false;
  const isLibraryItem = !!currentItemUri?.startsWith("library://");

  const [isToggling, setIsToggling] = useState(false);
  const [overrideFavorite, setOverrideFavorite] = useState<boolean | null>(null);
  const previousQueueFavoriteRef = useRef<boolean | null>(null);
  const previousQueueItemIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      previousQueueItemIdRef.current &&
      currentItem?.queue_item_id !== previousQueueItemIdRef.current
    ) {
      setOverrideFavorite(null);
    }

    previousQueueItemIdRef.current = currentItem?.queue_item_id;
  }, [currentItem?.queue_item_id]);

  useEffect(() => {
    if (
      previousQueueFavoriteRef.current !== null &&
      previousQueueFavoriteRef.current !== backendFavorite
    ) {
      setOverrideFavorite(null);
    }

    previousQueueFavoriteRef.current = backendFavorite;
  }, [backendFavorite]);

  const refreshFavorite = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useEffect(() => {
    if (!enabled) return;
    void refreshFavorite();
  }, [
    enabled,
    player.attributes.media_content_id,
    player.attributes.media_title,
    player.attributes.media_artist,
    refreshFavorite,
  ]);

  useEffect(() => {
    if (!ENABLE_BACKGROUND_FAVORITE_POLLING || !enabled || isToggling) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshFavorite();
    }, FAVORITE_POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [enabled, isToggling, refreshFavorite]);

  useEffect(() => {
    if (!enabled || !maEntityId || !favoriteButtonEntityId) {
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const subscribeToFavoriteEvents = async () => {
      unsubscribe = await getHass().connection.subscribeEvents(
        (event: {
          data?: {
            domain?: string;
            service?: string;
            service_data?: {
              entity?: unknown;
              entity_id?: unknown;
            };
          };
        }) => {
          const domain = event.data?.domain;
          const service = event.data?.service;
          const serviceData = event.data?.service_data;

          const favoriteButtonPressed =
            domain === "button" &&
            service === "press" &&
            matchesEntityId(serviceData?.entity_id, favoriteButtonEntityId);

          const queueUnfavorited =
            domain === "mass_queue" &&
            service === "unfavorite_current_item" &&
            matchesEntityId(serviceData?.entity, maEntityId);

          if (!favoriteButtonPressed && !queueUnfavorited) {
            return;
          }

          setOverrideFavorite(favoriteButtonPressed);
          void refreshFavorite();
        },
        "call_service"
      );

      if (cancelled && unsubscribe) {
        unsubscribe();
      }
    };

    void subscribeToFavoriteEvents();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [enabled, favoriteButtonEntityId, maEntityId, refreshFavorite]);

  const toggleFavorite = useCallback(async () => {
    if (!enabled || !maEntityId || !favoriteButtonEntityId || isToggling) {
      return;
    }

    const shouldFavorite = !(overrideFavorite ?? backendFavorite);

    setIsToggling(true);
    setOverrideFavorite(shouldFavorite);

    try {
      await sleep(CLICK_BUSY_DELAY_MS);

      if (shouldFavorite) {
        await getHass().callService("button", "press", {
          entity_id: favoriteButtonEntityId,
        });
      } else {
        await getHass().callService("mass_queue", "unfavorite_current_item", {
          entity: maEntityId,
        });
      }

      await refreshFavorite();
    } finally {
      setIsToggling(false);
    }
  }, [
    backendFavorite,
    enabled,
    favoriteButtonEntityId,
    isToggling,
    maEntityId,
    overrideFavorite,
    refreshFavorite,
  ]);

  return useMemo(
    () => ({
      activeColor: controlConfig?.active_color?.trim() || "#f2c94c",
      enabled,
      favoriteButtonOffset:
        controlConfig?.favorite_button_offset?.trim() || "14px",
      favoriteButtonSize: controlConfig?.favorite_button_size ?? "small",
      isLibraryItem,
      inactiveColor: controlConfig?.inactive_color?.trim() || "#111111",
      isFavorite: overrideFavorite ?? backendFavorite,
      isLoading: isToggling,
      toggleFavorite,
      unsupportedMessage:
        !isLibraryItem && (overrideFavorite ?? backendFavorite)
          ? "Unfavorite is only available for library tracks."
          : undefined,
    }),
    [
      backendFavorite,
      controlConfig?.active_color,
      controlConfig?.favorite_button_offset,
      controlConfig?.favorite_button_size,
      controlConfig?.inactive_color,
      enabled,
      isLibraryItem,
      isToggling,
      overrideFavorite,
      toggleFavorite,
    ]
  );
};
