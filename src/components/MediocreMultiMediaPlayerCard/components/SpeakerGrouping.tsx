import { useContext, useMemo, useState } from "preact/hooks";
import type {
  MediaPlayerEntity,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import {
  AlbumArt,
  CardContext,
  CardContextType,
  GroupChipsController,
  GroupVolumeController,
  IconButton,
  PlayerContextProvider,
  useHass,
} from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { ViewHeader } from "./ViewHeader";

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
  miniPlayer: css({
    padding: 4,
    borderRadius: 4,
    boxShadow: `0 0 6px ${theme.colors.onCardDivider}`,
    display: "flex",
    alignItems: "center",
    gap: 8,
  }),
  miniPlayerSelectButton: css({
    marginLeft: "auto",
  }),
};

export type SpeakerGroupingProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  setSelectedPlayer: (player: MediocreMultiMediaPlayer) => void;
};

export const SpeakerGrouping = ({
  mediaPlayer,
  setSelectedPlayer,
}: SpeakerGroupingProps) => {
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );
  const hass = useHass();

  const { speaker_group, media_players } = config;
  const { entity_id, speaker_group_entity_id } = mediaPlayer;

  // TODO: Volume sync should be liftet to a context so it is also active for the main mini player
  const [syncMainSpeakerVolume, setSyncMainSpeakerVolume] = useState(true);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group_entity_id || entity_id;

  const enrichedEntities = useMemo(() => {
    return (
      media_players.map(player => {
        const playerState = hass.states[player.entity_id] as MediaPlayerEntity;
        return {
          ...playerState,
          isMainSpeaker: player.entity_id === entity_id,
          selectPlayer: () => setSelectedPlayer(player),
        };
      }) ?? []
    );
  }, [hass, entity_id, media_players, setSelectedPlayer]);

  const renderPlayer = (player: (typeof enrichedEntities)[number]) => {
    if (!player) {
      return null;
    }
    return (
      <PlayerContextProvider
        key={player.entity_id}
        hass={hass}
        entityId={player.entity_id}
      >
        <div css={styles.miniPlayer}>
          <AlbumArt size={32} iconSize="x-small" />
          <span>{player.attributes.friendly_name}</span>
          <IconButton
            icon={
              player.isMainSpeaker
                ? "mdi:check-circle-outline"
                : "mdi:circle-outline"
            }
            css={styles.miniPlayerSelectButton}
            onClick={player.selectPlayer}
            size="x-small"
          />
        </div>
      </PlayerContextProvider>
    );
  };

  return (
    <div css={styles.speakerGroupContainer}>
      <ViewHeader
        title="Join media players"
        subtitle="Selected player grouping."
        css={styles.horizontalPadding}
        renderAction={() => (
          <div css={styles.syncContainer}>
            <span
              css={styles.syncText}
              onClick={() => setSyncMainSpeakerVolume(!syncMainSpeakerVolume)}
            >
              Link Volume
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
        )}
      />
      <GroupVolumeController
        config={{
          entity_id,
          speaker_group: {
            entities: speaker_group?.entities || [],
            entity_id: mainEntityId,
          },
        }}
        syncMainSpeaker={syncMainSpeakerVolume}
        css={styles.horizontalPadding}
      />
      <div>
      <GroupChipsController
        config={{ entity_id: mainEntityId, speaker_group }}
        showGrouped={false}
        layout={{ horizontalMargin: 16 }}
        />
        </div>
      <ViewHeader
        title="Player focus"
        subtitle="Change which player you are controlling."
        css={styles.horizontalPadding}
      />
      <div css={[styles.playerSelector, styles.horizontalPadding]}>
        {enrichedEntities.length > 0 && enrichedEntities.map(renderPlayer)}
      </div>
    </div>
  );
};
