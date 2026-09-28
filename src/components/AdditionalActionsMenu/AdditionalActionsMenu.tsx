import { useMemo, useCallback } from "preact/hooks";
import {
  getAllMassPlayers,
  getAllSqueezeboxPlayers,
  getHass,
  getIsLmsPlayer,
  getHasMassFeatures,
  transferLmsQueue,
  transferMaQueue,
  getIsMassPlayer,
} from "@utils";
import {
  OverlayMenu,
  OverlayMenuItem,
  OverlayMenuProps,
} from "@components/OverlayMenu/OverlayMenu";
import { usePlayer } from "@components/PlayerContext";
import { useIntl } from "@components/i18n";

export type AdditionalActionsMenuProps = {
  ma_entity_id?: string;
  ma_favorite_button_entity_id?: string;
  lms_entity_id?: string;
  noSourceSelection?: boolean;
  noSoundModeSelection?: boolean;
} & Omit<OverlayMenuProps, "menuItems" | "children">;

export const AdditionalActionsMenu = ({
  ma_entity_id,
  ma_favorite_button_entity_id,
  lms_entity_id,
  noSourceSelection,
  noSoundModeSelection,
  ...overlayMenuProps
}: AdditionalActionsMenuProps) => {
  const { t } = useIntl();
  const player = usePlayer();
  const isMainEntityMassPlayer = useMemo(
    () => getHasMassFeatures(player?.entity_id, ma_entity_id),
    [player, ma_entity_id]
  );

  const isMainEntityLmsPlayer = useMemo(
    () => lms_entity_id && getIsLmsPlayer(player, lms_entity_id),
    [player, lms_entity_id]
  );

  const markSongAsFavorite = useCallback(() => {
    if (!ma_favorite_button_entity_id) return;
    getHass().callService("button", "press", {
      entity_id: ma_favorite_button_entity_id,
    });
  }, [ma_favorite_button_entity_id]);

  const transferQueue = useCallback(
    (targetEntity: string) => {
      if (!ma_entity_id) return;
      transferMaQueue(ma_entity_id, targetEntity);
    },
    [ma_entity_id]
  );

  const menuItems: OverlayMenuItem[] = useMemo(() => {
    const items: OverlayMenuItem[] = [];
    if (ma_entity_id && isMainEntityMassPlayer) {
      const massPlayers = getAllMassPlayers().filter(
        player =>
          player.entity_id !== ma_entity_id &&
          getIsMassPlayer(player) &&
          player.state !== "unavailable"
      );

      if (ma_favorite_button_entity_id) {
        items.push({
          label: t({
            id: "AdditionalActionsMenu.mark_as_favorite",
          }),
          icon: "mdi:heart-plus",
          onClick: markSongAsFavorite,
        });
      }
      if (massPlayers.length > 0) {
        items.push({
          label: t({
            id: "AdditionalActionsMenu.transfer_queue",
          }),
          icon: "mdi:transfer",
          children: massPlayers.map(player => ({
            label: player.attributes.friendly_name || player.entity_id,
            onClick: () => transferQueue(player.entity_id),
          })),
        });
      }
    }
    if (lms_entity_id && isMainEntityLmsPlayer) {
      const allLmsPlayers = getAllSqueezeboxPlayers().filter(
        player =>
          player.entity_id !== lms_entity_id && player.state !== "unavailable"
      );
      if (allLmsPlayers.length > 0) {
        items.push({
          label: t({
            id: "AdditionalActionsMenu.transfer_queue",
          }),
          icon: "mdi:transfer",
          children: allLmsPlayers.map(player => ({
            label: player.attributes.friendly_name || player.entity_id,
            onClick: () => {
              transferLmsQueue(lms_entity_id, player.entity_id);
            },
          })),
        });
      }
    }

    if (
      !noSourceSelection &&
      player.attributes.source_list?.length &&
      player.attributes.source_list?.length > 0
    ) {
      items.push({
        label: t({
          id: "AdditionalActionsMenu.select_source",
        }),
        icon: "mdi:import",
        children: (player.attributes.source_list ?? []).map(source => ({
          label: source,
          onClick: () => {
            getHass().callService("media_player", "select_source", {
              entity_id: player.entity_id,
              source,
            });
          },
        })),
      });
    }
    if (
      !noSoundModeSelection &&
      player.attributes.sound_mode_list?.length &&
      player.attributes.sound_mode_list?.length > 0
    ) {
      items.push({
        label: t({
          id: "AdditionalActionsMenu.select_sound_mode",
        }),
        icon: "mdi:equalizer",
        children: (player.attributes.sound_mode_list ?? []).map(sound_mode => ({
          label: sound_mode,
          selected: sound_mode === player.attributes.sound_mode,
          onClick: () => {
            getHass().callService("media_player", "select_sound_mode", {
              entity_id: player.entity_id,
              sound_mode,
            });
          },
        })),
      });
    }
    return items;
  }, [
    ma_favorite_button_entity_id,
    isMainEntityMassPlayer,
    isMainEntityLmsPlayer,
    ma_entity_id,
    lms_entity_id,
    markSongAsFavorite,
    transferQueue,
    noSourceSelection,
    noSoundModeSelection,
    player.attributes.source_list,
    player.attributes.sound_mode_list,
    player.attributes.sound_mode,
    player.entity_id,
    t,
  ]);

  if (menuItems.length === 0) return null;

  return <OverlayMenu menuItems={menuItems} {...overlayMenuProps} />;
};
