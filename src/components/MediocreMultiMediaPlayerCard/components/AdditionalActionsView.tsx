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
import {
  getHass,
  getIsLmsPlayer,
  getIsMassPlayer,
  getSourceIcon,
  transferLmsQueue,
  transferMaQueue,
} from "@utils";
import { Fragment } from "preact/jsx-runtime";
import {
  OverlayMenu,
  OverlayMenuItem,
} from "@components/OverlayMenu/OverlayMenu";
import { memo } from "preact/compat";
import { useIntl } from "@components/i18n";

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

export type AdditionalActionsViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  setSelectedPlayer: (player: MediocreMultiMediaPlayer) => void;
};

export const AdditionalActionsView = memo<AdditionalActionsViewProps>(
  ({ mediaPlayer, setSelectedPlayer }) => {
    const {
      custom_buttons,
      ma_favorite_button_entity_id,
      ma_entity_id,
      lms_entity_id,
    } = mediaPlayer;

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

    const isMainEntityLmsPlayer = useMemo(
      () => lms_entity_id && getIsLmsPlayer(player, lms_entity_id),
      [player, lms_entity_id]
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

    const lmsTransferMenuItems: OverlayMenuItem[] = useMemo(() => {
      if (!lms_entity_id || !isMainEntityLmsPlayer) return [];
      const items: (OverlayMenuItem | null)[] = media_players.map(mp => {
        if (!mp.lms_entity_id) return null;
        const state = hass.states[mp.entity_id];
        if (
          !state ||
          state.state === "unavailable" ||
          mp.entity_id === mediaPlayer.entity_id
        )
          return null;
        return {
          label: mp.name || state.attributes.friendly_name || mp.entity_id,
          onClick: () => {
            if (!mp.lms_entity_id) return;
            transferLmsQueue(lms_entity_id, mp.lms_entity_id);
            setSelectedPlayer(mp);
          },
        };
      });

      return items.filter(item => item !== null) as OverlayMenuItem[];
    }, [
      isMainEntityLmsPlayer,
      lms_entity_id,
      media_players,
      setSelectedPlayer,
    ]);

    const markSongAsFavorite = useCallback(() => {
      if (!ma_favorite_button_entity_id) return;
      getHass().callService("button", "press", {
        entity_id: ma_favorite_button_entity_id,
      });
    }, [ma_favorite_button_entity_id]);

    const sourceSelectMenuItems: OverlayMenuItem[] = useMemo(() => {
      return (player.attributes.source_list ?? []).map(source => ({
        label: source,
        onClick: () => {
          getHass().callService("media_player", "select_source", {
            entity_id: player.entity_id,
            source,
          });
        },
      }));
    }, [player.attributes.source_list, player.attributes.source]);

    const renderMediaPlayerActions =
      (!!ma_entity_id && isMainEntityMassPlayer) ||
      sourceSelectMenuItems.length > 0;

    const { t } = useIntl();

    return (
      <div css={styles.root}>
        {custom_buttons && custom_buttons.length > 0 && (
          <Fragment>
            <ViewHeader
              title={t({
                id: "MediocreMultiMediaPlayerCard.AdditionalActionsView.shortcuts_title",
              })}
              subtitle={t({
                id: "MediocreMultiMediaPlayerCard.AdditionalActionsView.shortcuts_subtitle",
              })}
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
        {renderMediaPlayerActions && (
          <Fragment>
            <ViewHeader
              title={t({
                id: "MediocreMultiMediaPlayerCard.AdditionalActionsView.media_player_actions_title",
              })}
              subtitle={t({
                id: "MediocreMultiMediaPlayerCard.AdditionalActionsView.media_player_actions_subtitle",
              })}
            />
            <div css={styles.buttons}>
              {!!ma_entity_id && isMainEntityMassPlayer && (
                <Fragment>
                  {ma_favorite_button_entity_id && (
                    <Chip icon="mdi:heart-plus" onClick={markSongAsFavorite}>
                      {t({
                        id: "MediocreMultiMediaPlayerCard.AdditionalActionsView.mark_as_favorite",
                      })}
                    </Chip>
                  )}
                  {maTransferMenuItems.length > 0 && (
                    <OverlayMenu
                      menuItems={maTransferMenuItems}
                      side="bottom"
                      renderTrigger={triggerProps => (
                        <Chip icon="mdi:transfer" {...triggerProps}>
                          {t({
                            id: "MediocreMultiMediaPlayerCard.AdditionalActionsView.transfer_queue",
                          })}
                          <Icon size="x-small" icon="mdi:chevron-down" />
                        </Chip>
                      )}
                    />
                  )}
                </Fragment>
              )}
              {lmsTransferMenuItems.length > 0 && (
                <OverlayMenu
                  menuItems={lmsTransferMenuItems}
                  side="bottom"
                  renderTrigger={triggerProps => (
                    <Chip icon="mdi:transfer" {...triggerProps}>
                      {t({
                        id: "MediocreMultiMediaPlayerCard.AdditionalActionsView.transfer_queue",
                      })}
                      <Icon size="x-small" icon="mdi:chevron-down" />
                    </Chip>
                  )}
                />
              )}
              {sourceSelectMenuItems.length > 0 && player.attributes.source && (
                <OverlayMenu
                  side="bottom"
                  menuItems={sourceSelectMenuItems}
                  renderTrigger={triggerProps => (
                    <Chip
                      {...triggerProps}
                      icon={getSourceIcon({
                        source: player.attributes.source ?? "",
                        fallbackIcon: "mdi:import",
                      })}
                    >
                      {player.attributes.source}
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
  }
);

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
