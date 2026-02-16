import { useContext, useMemo, useState } from "preact/hooks";
import type {
  MediaPlayerEntity,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { Fragment } from "preact/jsx-runtime";
import {
  CardContext,
  CardContextType,
  useHass,
  GroupVolumeController,
  IconButton,
  PlayerContextProvider,
  Chip,
  Icon,
  AlbumArt,
} from "@components";
import { GroupChipsController } from "@components/GroupChipsController";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { useIntl } from "@components/i18n";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";
import { getHass } from "@utils";

const styles = {
  speakerGroupContainer: css({
    display: "flex",
    flexDirection: "column",
    paddingTop: "12px",
    paddingBottom: "16px",
    borderTop: `0.5px solid ${theme.colors.onCardDivider}`,
    gap: "12px",
  }),
  groupTitle: css({
    fontSize: "16px",
    fontWeight: 500,
    color: theme.colors.onCard,
    margin: "0px 16px",
  }),
  syncContainer: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: "4px",
    marginRight: "19px",
  }),
  syncText: css({
    fontSize: "12px",
    color: theme.colors.onCardMuted,
  }),
  groupedSpeakers: css({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginLeft: "16px",
    marginRight: "16px",
  }),
  titleRow: css({
    display: "flex",
    alignItems: "center",
  }),
  playerChips: css({
    display: "flex",
    flexDirection: "row",
    gap: "6px 2px",
    overflowX: "auto",
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),
  chipPlayer: css({
    padding: "0px 6px",
    gap: 6,
    "&:first-child": {
      marginLeft: 16,
    },
    "&:last-child": {
      marginRight: 16,
    },
  }),
  chipPlayerOff: css({
    opacity: 0.8,
  }),
  chipPlayerArtwork: css({
    borderRadius: "50%",
  }),
};

export const SpeakerGrouping = () => {
  const { selectedPlayer, setSelectedPlayer } = useSelectedPlayer();
  const { t } = useIntl();
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );
  const hass = useHass();

  const { media_players } = config;
  const { entity_id, speaker_group_entity_id } = selectedPlayer || {};
  // TODO: Volume sync should be liftet to a context so it is also active for the main mini player
  const [syncMainSpeakerVolume, setSyncMainSpeakerVolume] = useState(true);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group_entity_id || entity_id;

  const enrichedEntities = useMemo(() => {
    return (
      media_players.map(player => {
        const playerState = hass.states[player.entity_id] as MediaPlayerEntity;
        const groupPlayerState = hass.states[
          player.speaker_group_entity_id || player.entity_id
        ] as MediaPlayerEntity;
        const groupArray = groupPlayerState?.attributes?.group_members ?? [];
        const isChildInGroup =
          groupArray.length === 0
            ? false
            : groupArray[0] !== groupPlayerState.entity_id;
        return {
          ...playerState,
          name: player.name ?? playerState?.attributes?.friendly_name,
          groupPlayerState,
          isChildInGroup,
          numPlayersInGroup: (groupPlayerState?.attributes?.group_members ?? [])
            .length,
          isMainSpeaker: player.entity_id === entity_id,
          selectPlayer: () => setSelectedPlayer(player),
        };
      }) ?? []
    );
  }, [hass, entity_id, media_players, setSelectedPlayer]);

  const groupableEntities = useMemo(() => {
    return media_players
      .filter(player => player.can_be_grouped)
      .map(player => {
        if (player.name) {
          return {
            name: player.name,
            entity: player.speaker_group_entity_id ?? player.entity_id,
          };
        } else {
          return player.speaker_group_entity_id ?? player.entity_id;
        }
      });
  }, [media_players]);

  const renderPlayer = (player: (typeof enrichedEntities)[number]) => {
    if (!player || player.isChildInGroup) {
      return null;
    }

    return (
      <PlayerContextProvider key={player.entity_id} entityId={player.entity_id}>
        {({ player: { state } }) => {
          return (
            <Chip
              css={[
                styles.chipPlayer,

                player.state === "off" && styles.chipPlayerOff,
              ]}
              onClick={() => player.selectPlayer()}
            >
              <AlbumArt
                size={22}
                iconSize="x-small"
                css={styles.chipPlayerArtwork}
                onClick={player.selectPlayer}
              />

              {`${player.name}${player.numPlayersInGroup > 1 ? ` +${player.numPlayersInGroup - 1}` : ""}`}

              {state === "playing" || state === "paused" ? (
                <IconButton
                  size="x-small"
                  onClick={e => {
                    e.stopPropagation();

                    e.preventDefault();

                    getHass().callService(
                      "media_player",

                      "media_play_pause",

                      {
                        entity_id: player.entity_id,
                      }
                    );
                  }}
                  icon={
                    state === "playing"
                      ? "mdi:pause-circle-outline"
                      : "mdi:play-circle-outline"
                  }
                />
              ) : state === "off" || state === "idle" ? (
                <IconButton
                  size="x-small"
                  onClick={e => {
                    e.stopPropagation();

                    e.preventDefault();

                    getHass().callService("media_player", "toggle", {
                      entity_id: player.entity_id,
                    });
                  }}
                  icon="mdi:power"
                />
              ) : (
                <Icon size="x-small" icon="mdi:circle-small" />
              )}
            </Chip>
          );
        }}
      </PlayerContextProvider>
    );
  };

  if (!entity_id || !mainEntityId) return null;

  const mainEntity = hass.states[mainEntityId] as MediaPlayerEntity;
  const isGrouped = (mainEntity?.attributes?.group_members?.length ?? 0) > 1;

  return (
    <div css={styles.speakerGroupContainer}>
      {isGrouped && (
        <Fragment>
          <div css={styles.titleRow}>
            <h3 css={styles.groupTitle}>
              {t({
                id: "MediocreMediaPlayerCard.SpeakerGrouping.grouped_speakers_title",
              })}
            </h3>
            <div css={styles.syncContainer}>
              <span
                css={styles.syncText}
                onClick={() => setSyncMainSpeakerVolume(!syncMainSpeakerVolume)}
              >
                {t({
                  id: "MediocreMediaPlayerCard.SpeakerGrouping.link_volume_title",
                })}
              </span>
              <IconButton
                icon={
                  syncMainSpeakerVolume
                    ? "mdi:check-circle"
                    : "mdi:circle-outline"
                }
                size="x-small"
                onClick={() => setSyncMainSpeakerVolume(!syncMainSpeakerVolume)}
              />
            </div>
          </div>
          <div css={styles.groupedSpeakers}>
            <GroupVolumeController
              config={{
                entity_id,
                speaker_group: {
                  entities: groupableEntities,
                  entity_id: mainEntityId,
                },
                options: {
                  show_volume_step_buttons:
                    config.options?.show_volume_step_buttons ?? false,
                  use_volume_up_down_for_step_buttons:
                    config.options?.use_volume_up_down_for_step_buttons ??
                    false,
                },
              }}
              syncMainSpeaker={syncMainSpeakerVolume}
            />
          </div>
        </Fragment>
      )}
      {!isGrouped && (
        <h3 css={styles.groupTitle}>
          {t({
            id: "MediocreMediaPlayerCard.SpeakerGrouping.add_speakers_title",
          })}
        </h3>
      )}
      <GroupChipsController
        config={{
          entity_id: mainEntityId,
          speaker_group: { entities: groupableEntities },
        }}
        showGrouped={false}
        layout={{ horizontalMargin: 16 }}
      />
      {!config.disable_player_focus_switching && (
        <Fragment>
          <h3 css={styles.groupTitle}>
            {t({
              id: "MediocreMultiMediaPlayerCard.SpeakerGrouping.player_focus_title",
            })}
          </h3>
          <div css={styles.playerChips}>
            {enrichedEntities.length > 0 && enrichedEntities.map(renderPlayer)}
          </div>
        </Fragment>
      )}
    </div>
  );
};
