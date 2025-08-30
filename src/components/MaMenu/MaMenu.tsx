import { useMemo, useCallback } from "preact/hooks";
import {
  getAllMassPlayers,
  getHass,
  getIsMassPlayer,
  transferMaQueue,
} from "@utils";
import { JSX } from "preact";
import {
  OverlayMenu,
  OverlayMenuItem,
} from "@components/OverlayMenu/OverlayMenu";
import { usePlayer } from "@components/PlayerContext";

export type MaMenuProps = {
  ma_entity_id?: string;
  ma_favorite_button_entity_id?: string;
  renderTrigger: (onClick: () => void) => JSX.Element;
};

export const MaMenu = ({
  renderTrigger,
  ma_entity_id,
  ma_favorite_button_entity_id,
}: MaMenuProps) => {
  const player = usePlayer();
  const isMainEntityMassPlayer = useMemo(
    () => getIsMassPlayer(player),
    [player]
  );

  const markSongAsFavorite = useCallback(() => {
    if (!ma_favorite_button_entity_id) return;
    console.log("Marking song as favorite");
    getHass().callService("button", "press", {
      entity_id: ma_favorite_button_entity_id,
    });
  }, [ma_favorite_button_entity_id]);

  const transferQueue = useCallback(
    (targetEntity: string) => {
      console.log("Transfer to:", targetEntity);
      if (!ma_entity_id) return;
      console.log("Transferring queue to:", targetEntity);
      transferMaQueue(ma_entity_id, targetEntity);
    },
    [ma_entity_id]
  );

  const menuItems: OverlayMenuItem[] = useMemo(() => {
    if (!ma_entity_id || !isMainEntityMassPlayer) return [];
    const massPlayers = getAllMassPlayers().filter(
      player =>
        player.entity_id !== ma_entity_id &&
        getIsMassPlayer(player) &&
        player.state !== "unavailable"
    );

    const items: OverlayMenuItem[] = [];
    if (ma_favorite_button_entity_id) {
      items.push({
        label: "Mark as Favorite",
        icon: "mdi:heart-plus",
        onClick: markSongAsFavorite,
      });
    }
    if (massPlayers.length > 0) {
      items.push({
        label: "Transfer Queue",
        icon: "mdi:transfer",
        children: massPlayers.map(player => ({
          label: player.attributes.friendly_name || player.entity_id,
          onClick: () => transferQueue(player.entity_id),
        })),
      });
    }
    return items;
  }, [ma_favorite_button_entity_id, markSongAsFavorite, transferQueue]);

  console.log(menuItems);
  if (menuItems.length === 0) return null;

  return <OverlayMenu trigger={renderTrigger} menuItems={menuItems} />;
};
