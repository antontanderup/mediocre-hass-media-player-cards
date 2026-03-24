import { useContext } from "preact/hooks";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
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
        media_type?: string;
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

const REFRESH_AFTER_TOGGLE_MS = 500;

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
  const hasMassFeatures = getHasMassFeatures(
    player.entity_id,
    maEntityId ?? undefined
  );
  const controlConfig = config.ma_favorite_control;
  const controlEnabled =
    controlConfig?.enabled !== false &&
    hasMassFeatures &&
    !!maEntityId &&
    !!favoriteButtonEntityId;

  const queueMessage = useMemo(
    () =>
      controlEnabled
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
    [controlEnabled, maEntityId]
  );

  const queueQueryOptions = useMemo(
    () => ({
      enabled: controlEnabled,
      staleTime: 5000,
    }),
    [controlEnabled]
  );

  const { data, loading, error, refetch } =
    useHassMessagePromise<MaFavoriteQueueResponse>(queueMessage, queueQueryOptions);

  const currentItem = maEntityId ? data?.[maEntityId]?.current_item : undefined;
  const currentItemUri = currentItem?.media_item?.uri;
  const backendFavorite = currentItem?.media_item?.favorite;
  const canRemoveFavorite =
    !!currentItemUri &&
    (currentItemUri.startsWith("library://") ||
      currentItemUri.startsWith("library--") ||
      currentItemUri.startsWith("library:"));
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(
    null
  );
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setOptimisticFavorite(null);
  }, [currentItem?.queue_item_id, backendFavorite]);

  useEffect(() => {
    if (!controlEnabled) return;
    refetch();
  }, [
    controlEnabled,
    player.attributes.media_content_id,
    player.attributes.media_title,
    player.attributes.media_artist,
    refetch,
  ]);

  const refreshFavoriteState = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, REFRESH_AFTER_TOGGLE_MS));
    await refetch();
  }, [refetch]);

  const addFavorite = useCallback(async () => {
    if (!favoriteButtonEntityId) return;
    setIsToggling(true);
    setOptimisticFavorite(true);
    try {
      await getHass().callService("button", "press", {
        entity_id: favoriteButtonEntityId,
      });
      await refreshFavoriteState();
    } finally {
      setIsToggling(false);
    }
  }, [favoriteButtonEntityId, refreshFavoriteState]);

  const removeFavorite = useCallback(async () => {
    if (!maEntityId || !canRemoveFavorite) return;
    setIsToggling(true);
    setOptimisticFavorite(false);
    try {
      await getHass().callService("mass_queue", "unfavorite_current_item", {
        entity: maEntityId,
      });
      await refreshFavoriteState();
    } finally {
      setIsToggling(false);
    }
  }, [canRemoveFavorite, maEntityId, refreshFavoriteState]);

  const isFavorite = optimisticFavorite ?? backendFavorite ?? false;

  const toggleFavorite = useCallback(async () => {
    if (!controlEnabled) return;
    if (isFavorite) {
      await removeFavorite();
      return;
    }
    await addFavorite();
  }, [addFavorite, controlEnabled, isFavorite, removeFavorite]);

  return useMemo(
    () => ({
      activeColor: controlConfig?.active_color ?? "#f2c94c",
      activeIcon: controlConfig?.active_icon ?? "mdi:star",
      artworkInsetRight: controlConfig?.artwork_inset_right ?? "14px",
      artworkInsetTop: controlConfig?.artwork_inset_top ?? "14px",
      canRemoveFavorite,
      currentItem,
      enabled: controlEnabled,
      error,
      inactiveIcon: controlConfig?.inactive_icon ?? "mdi:star-outline",
      isFavorite,
      isLoading: loading || isToggling,
      refetch,
      unsupportedMessage:
        isFavorite && !canRemoveFavorite
          ? "Unfavorite is only supported for library items right now."
          : undefined,
      toggleFavorite,
    }),
    [
      controlConfig?.active_color,
      controlConfig?.active_icon,
      controlConfig?.artwork_inset_right,
      controlConfig?.artwork_inset_top,
      canRemoveFavorite,
      currentItem,
      controlEnabled,
      error,
      controlConfig?.inactive_icon,
      isFavorite,
      loading,
      isToggling,
      refetch,
      toggleFavorite,
    ]
  );
};
