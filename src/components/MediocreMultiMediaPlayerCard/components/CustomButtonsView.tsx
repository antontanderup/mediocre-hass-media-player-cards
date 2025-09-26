import { useCallback, useContext, useMemo } from "preact/hooks";
import type {
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { InteractionConfig } from "@types";
import { Chip, Icon, useHass, usePlayer } from "@components";
import { useActionProps } from "@hooks";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import { getHass, getIsMassPlayer, transferMaQueue } from "@utils";
import { Fragment } from "preact/jsx-runtime";
import {
  OverlayMenu,
  OverlayMenuItem,
} from "@components/OverlayMenu/OverlayMenu";
import { memo } from "preact/compat";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    overflowY: "auto",
    padding: 16,
    gap: 12,
  }),
  buttons: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: "6px 2px",
  }),
};

export type CustomButtonsViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  setSelectedPlayer: (player: MediocreMultiMediaPlayer) => void;
};

export const CustomButtonsView = memo<CustomButtonsViewProps>(({
  mediaPlayer,
  setSelectedPlayer,
}) => {
  const { custom_buttons, ma_favorite_button_entity_id, ma_entity_id } =
    mediaPlayer;

  const {
    config: { media_players },
  } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const hass = useHass();

  const player = usePlayer();
  const isMainEntityMassPlayer = useMemo(
    () => getIsMassPlayer(player),
    [player, player?.attributes?.active_child]
  );

  const transferQueue = useCallback(
    (targetEntity: string) => {
      if (!ma_entity_id) return;
      transferMaQueue(ma_entity_id, targetEntity);
    },
    [ma_entity_id]
  );

  const maTransferMenuItems: OverlayMenuItem[] = useMemo(() => {
    if (!ma_entity_id || !isMainEntityMassPlayer) return [];
    const items: (OverlayMenuItem | null)[] = media_players.map(mp => {
      if (!mp.ma_entity_id) return null;
      const state = hass.states[mp.entity_id];
      if (
        !state ||
        state.state === "unavailable" ||
        mp.entity_id === mediaPlayer.entity_id
      )
        return null;
      return {
        label: state.attributes.friendly_name || mp.entity_id,
        onClick: () => {
          if (!mp.ma_entity_id) return;
          transferQueue(mp.ma_entity_id);
          setSelectedPlayer(mp);
        },
      };
    });

    return items.filter(item => item !== null) as OverlayMenuItem[];
  }, [
    isMainEntityMassPlayer,
    ma_entity_id,
    transferQueue,
    media_players,
    setSelectedPlayer,
  ]);

  const markSongAsFavorite = useCallback(() => {
    if (!ma_favorite_button_entity_id) return;
    getHass().callService("button", "press", {
      entity_id: ma_favorite_button_entity_id,
    });
  }, [ma_favorite_button_entity_id]);

  return (
    <div css={styles.root}>
      {custom_buttons && custom_buttons.length > 0 && (
        <Fragment>
          <ViewHeader
            title="Shortcuts"
            subtitle="Quick access to your favorite actions."
          />
          <div css={styles.buttons}>
            {custom_buttons?.map((button, index) => (
              <CustomButton
                key={index}
                button={button}
                entityId={mediaPlayer.entity_id}
              />
            ))}
          </div>
        </Fragment>
      )}
      {!!ma_entity_id && isMainEntityMassPlayer && (
        <Fragment>
          <ViewHeader
            title="Music Assistant"
            subtitle="Music Assistant specific actions."
          />
          <div css={styles.buttons}>
            {ma_favorite_button_entity_id && (
              <Chip icon="mdi:heart-plus" onClick={markSongAsFavorite}>
                Mark as Favorite
              </Chip>
            )}
            {maTransferMenuItems.length > 0 && (
              <OverlayMenu
                menuItems={maTransferMenuItems}
                side="bottom"
                renderTrigger={triggerProps => (
                  <Chip icon="mdi:transfer" {...triggerProps}>
                    Transfer Queue
                    <Icon size="x-small" icon="mdi:chevron-down" />
                  </Chip>
                )}
              />
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
});

const CustomButton = ({
  button,
  entityId,
}: {
  button: InteractionConfig & {
    icon?: string;
    name?: string;
  };
  entityId: string;
}) => {
  const { rootElement } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );
  const { icon, name, ...actionConfig } = button;
  const actionProps = useActionProps({
    rootElement,
    actionConfig: {
      ...actionConfig,
      entity: entityId,
    },
  });

  return (
    <Chip icon={icon} {...actionProps}>
      {!!name && <span>{name}</span>}
      {actionProps.renderLongPressIndicator()}
    </Chip>
  );
};
