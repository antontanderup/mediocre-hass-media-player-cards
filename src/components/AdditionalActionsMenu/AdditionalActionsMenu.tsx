import { useMemo, useCallback } from "preact/hooks";
import {
  getAllMassPlayers,
  getHass,
  getIsMassPlayer,
  transferMaQueue,
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
} & Omit<OverlayMenuProps, "menuItems" | "children">;

export const AdditionalActionsMenu = ({
  ma_entity_id,
  ma_favorite_button_entity_id,
  ...overlayMenuProps
}: AdditionalActionsMenuProps) => {
  const { t } = useIntl();
  const player = usePlayer();
  const isMainEntityMassPlayer = useMemo(
    () => getIsMassPlayer(player),
    [player]
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

    if (
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
    return items;
  }, [ma_favorite_button_entity_id, markSongAsFavorite, transferQueue]);

  if (menuItems.length === 0) return null;

  return <OverlayMenu menuItems={menuItems} {...overlayMenuProps} />;
};
