import { useContext, useMemo, useState } from "preact/hooks";
import { useIntl } from "@components/i18n";
import type {
  MediaPlayerEntity,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import {
  CardContext,
  CardContextType,
  GroupChipsController,
  GroupVolumeController,
  IconButton,
  PlayerContextProvider,
  TinyMediaPlayer,
  useHass,
} from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { ViewHeader } from "./ViewHeader";
import { Fragment } from "preact/jsx-runtime";
import { memo } from "preact/compat";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";

const styles = {
  speakerGroupContainer: css({
    display: "flex",
    flexDirection: "column",
    padding: "16px 0px",
    gap: "12px",
    overflowY: "auto",
    height: "100%",
  }),
  horizontalPadding: css({
    padding: "0px 16px",
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
  }),
  syncText: css({
    fontSize: "12px",
    color: theme.colors.onCardMuted,
  }),
  groupedSpeakers: css({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }),
  titleRow: css({
    display: "flex",
    alignItems: "center",
  }),
  playerSelector: css({
    display: "flex",
    flexDirection: "column",
    gap: 4,
  }),
  playerChips: css({
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    gap: "6px 2px",
  }),
  chipPlayer: css({
    padding: "0px 6px",
    gap: 6,
  }),
  chipPlayerOff: css({
    opacity: 0.8,
  }),
  chipPlayerArtwork: css({
    borderRadius: "50%",
  }),
};

export const SpeakerGrouping = memo(() => {
  const { selectedPlayer, setSelectedPlayer } = useSelectedPlayer();
  const mediaPlayer = selectedPlayer!;

  const { t } = useIntl();
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );
  const hass = useHass();

  const { media_players } = config;
  const { entity_id, speaker_group_entity_id } = mediaPlayer;

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
        <TinyMediaPlayer
          onClick={player.selectPlayer}
          name={`${player.name}${player.numPlayersInGroup > 1 ? ` +${player.numPlayersInGroup - 1}` : ""}`}
        />
      </PlayerContextProvider>
    );
  };

  return (
    <div css={styles.speakerGroupContainer}>
      {!!groupableEntities && groupableEntities.length > 0 && (
        <Fragment>
          <ViewHeader
            title={t({
              id: "MediocreMultiMediaPlayerCard.SpeakerGrouping.join_title",
            })}
            subtitle={t({
              id: "MediocreMultiMediaPlayerCard.SpeakerGrouping.join_subtitle",
            })}
            css={styles.horizontalPadding}
            renderAction={() => (
              <div css={styles.syncContainer}>
                <span
                  css={styles.syncText}
                  onClick={() =>
                    setSyncMainSpeakerVolume(!syncMainSpeakerVolume)
                  }
                >
                  {t({
                    id: "MediocreMultiMediaPlayerCard.SpeakerGrouping.link_volume",
                  })}
                </span>
                <IconButton
                  icon={
                    syncMainSpeakerVolume
                      ? "mdi:check-circle"
                      : "mdi:circle-outline"
                  }
                  size="x-small"
                  onClick={() =>
                    setSyncMainSpeakerVolume(!syncMainSpeakerVolume)
                  }
                />
              </div>
            )}
          />
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
                  config.options?.use_volume_up_down_for_step_buttons ?? false,
              },
            }}
            syncMainSpeaker={syncMainSpeakerVolume}
            css={styles.horizontalPadding}
          />
          <div>
            <GroupChipsController
              config={{
                entity_id: mainEntityId,
                speaker_group: { entities: groupableEntities },
              }}
              showGrouped={false}
              layout={{ horizontalMargin: 16 }}
            />
          </div>
        </Fragment>
      )}
      <ViewHeader
        title={t({
          id: "MediocreMultiMediaPlayerCard.SpeakerGrouping.player_focus_title",
        })}
        subtitle={t({
          id: "MediocreMultiMediaPlayerCard.SpeakerGrouping.player_focus_subtitle",
        })}
        css={styles.horizontalPadding}
      />
      <div css={[styles.playerChips, styles.horizontalPadding]}>
        {enrichedEntities.length > 0 && enrichedEntities.map(renderPlayer)}
      </div>
    </div>
  );
});
