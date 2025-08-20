import { useContext, useMemo, useCallback, useRef } from "preact/hooks";
import {
  getAllMassPlayers,
  getHass,
  getIsMassPlayer,
  transferMaQueue,
} from "@utils";
import { MediaPlayerEntity, MediocreMediaPlayerCardConfig } from "@types";
import { Fragment, JSX } from "preact";
import { useHass } from "@components/HassContext";
import { css } from "@emotion/react";
import { theme } from "@constants/theme";
import { Menu } from "@base-ui-components/react/menu";
import { Icon } from "@components/Icon";
import { CardContext, CardContextType } from "@components/CardContext";
import { usePlayer } from "@components/PlayerContext";

const styles = {
  popup: css({
    background: theme.colors.card,
    color: theme.colors.onCard,
    borderRadius: 12,
    minWidth: 180,
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    padding: 4,
    border: `1px solid ${theme.colors.onCardDivider}`,
  }),
  item: css({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    color: "inherit",
    transition: "background 0.15s",
    "&:hover, &[data-highlighted]": {
      background: theme.colors.onCardDivider,
    },
    "&[data-disabled]": {
      color: theme.colors.onCardMuted,
      cursor: "not-allowed",
    },
  }),
  submenuTrigger: css({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    color: "inherit",
    transition: "background 0.15s",
    "&:hover, &[data-highlighted]": {
      background: theme.colors.onCardDivider,
    },
  }),
  trigger: css({
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    boxShadow: "none",
    minWidth: 0,
    minHeight: 0,
    display: "inline",
    lineHeight: "inherit",
    color: "inherit",
    font: "inherit",
    cursor: "pointer",
  }),
  menuPortal: css({
    position: "fixed",
    zIndex: 9,
  }),
};

export type MaMenuProps = {
  renderTrigger: () => JSX.Element;
};

export const MaMenu = ({ renderTrigger }: MaMenuProps) => {
  const hass = useHass();
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id, ma_entity_id, ma_favorite_button_entity_id } = config;
  const player = usePlayer();

  const isMainEntityMassPlayer = getIsMassPlayer(player);

  const massPlayers = useMemo(() => {
    if (!isMainEntityMassPlayer) return [];
    return getAllMassPlayers().filter(
      player =>
        player.entity_id !== (ma_entity_id ?? entity_id) &&
        getIsMassPlayer(player) &&
        player.state !== "unavailable"
    );
  }, [hass.states, isMainEntityMassPlayer, ma_entity_id, entity_id]);

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

  const containerRef = useRef<HTMLDivElement>(null);

  if (!ma_entity_id || !isMainEntityMassPlayer) return null;

  return (
    <Fragment>
      <Menu.Root>
        <Menu.Trigger aria-label="Open menu" css={styles.trigger}>
          {renderTrigger()}
        </Menu.Trigger>
        <Menu.Portal container={containerRef}>
          <Menu.Positioner>
            <Menu.Popup css={styles.popup}>
              {ma_favorite_button_entity_id && (
                <Menu.Item
                  css={styles.item}
                  onClick={markSongAsFavorite}
                  disabled={!ma_favorite_button_entity_id}
                >
                  <Icon icon="mdi:heart-plus" size="x-small" />
                  <span>Mark as Favorite</span>
                </Menu.Item>
              )}
              {massPlayers.length > 0 && (
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger css={styles.submenuTrigger}>
                    <Icon icon="mdi:transfer" size="x-small" />
                    <span>Transfer Queue</span>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal container={containerRef}>
                    <Menu.Positioner alignOffset={4}>
                      <Menu.Popup css={styles.popup}>
                        {massPlayers.map(player => (
                          <Menu.Item
                            css={styles.item}
                            key={player.entity_id}
                            onClick={() => transferQueue(player.entity_id)}
                          >
                            {player.attributes.friendly_name ||
                              player.entity_id}
                          </Menu.Item>
                        ))}
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <div ref={containerRef} css={styles.menuPortal} />
    </Fragment>
  );
};
