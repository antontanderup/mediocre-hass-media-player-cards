import { useCallback, useContext, useMemo } from "preact/hooks";
import type {
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { InteractionConfig } from "@types";
import { Chip, usePlayer } from "@components";
import { useActionProps } from "@hooks";
import { css } from "@emotion/react";
import { ViewHeader } from "./ViewHeader";
import {
  getAllMassPlayers,
  getHass,
  getIsMassPlayer,
  transferMaQueue,
} from "@utils";
import { Fragment } from "preact/jsx-runtime";
import {
  OverlayMenu,
  OverlayMenuItem,
} from "@components/OverlayMenu/OverlayMenu";

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
    gap: "8px 4px",
  }),
};

export type CustomButtonsViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
};

export const CustomButtonsView = ({ mediaPlayer }: CustomButtonsViewProps) => {
  const { custom_buttons, ma_favorite_button_entity_id, ma_entity_id } =
    mediaPlayer;

  const player = usePlayer();
  const isMainEntityMassPlayer = useMemo(
    () => getIsMassPlayer(player),
    [player]
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
    const massPlayers = getAllMassPlayers().filter(
      player =>
        player.entity_id !== ma_entity_id &&
        getIsMassPlayer(player) &&
        player.state !== "unavailable"
    );

    const items: OverlayMenuItem[] = massPlayers.map(player => ({
      label: player.attributes.friendly_name || player.entity_id,
      onClick: () => transferQueue(player.entity_id),
    }));
    return items;
  }, [ma_favorite_button_entity_id, transferQueue]);

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
                  </Chip>
                )}
              />
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
};

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
