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
    padding: "16px",
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
  miniPlayer: css({
    padding: 4,
    borderRadius: 4,
    backgroundColor: theme.colors.onCardDivider,
    display: "flex",
    alignItems: "center",
    gap: 8,
  })
};

export type SpeakerGroupingProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
};

export const SpeakerGrouping = ({ mediaPlayer }: SpeakerGroupingProps) => {
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );
  const hass = useHass();

  const { speaker_group } = config;
  const { entity_id, speaker_group_entity_id } = mediaPlayer;

  // TODO: Volume sync should be liftet to a context so it is also active for the main mini player
  const [syncMainSpeakerVolume, setSyncMainSpeakerVolume] = useState(true);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group_entity_id || entity_id;

  const enrichedEntities = useMemo(() => {
    const mainGroupingPlayer = hass.states[mainEntityId];
    return speaker_group?.entities.map((entity) => {
      const entityId = typeof entity === "string" ? entity : entity.entity;
      const player = hass.states[entityId] as MediaPlayerEntity
      return {
        ...player,
        attributes: {
          ...player?.attributes,
          friendly_name: typeof entity !== "string" && entity.name ? entity.name : player?.attributes.friendly_name || entityId,
        },
        isGrouped: !!player && mainGroupingPlayer.attributes.group_members.includes(entityId),
        isMainSpeaker: player.entity_id === mainEntityId,
      }
    }) ?? [];
  }, [hass, mainEntityId]);
  console.log(enrichedEntities)

  const renderPlayer = (player: typeof enrichedEntities[number]) => {
    if (!player || player.isMainSpeaker) { return null; }
    return (
      <PlayerContextProvider key={player.entity_id} hass={hass} entityId={player.entity_id}>
        <div css={styles.miniPlayer}>
          <AlbumArt size={24} iconSize="x-small" />
          <span>{player.attributes.friendly_name}</span>
        </div>
      </PlayerContextProvider>
    );
  };

  return (
    <div css={styles.speakerGroupContainer}>
      <ViewHeader title="Join media players" subtitle="Selected player grouping." renderAction={() => (
        <div css={styles.syncContainer}>
          <span
            css={styles.syncText}
            onClick={() => setSyncMainSpeakerVolume(!syncMainSpeakerVolume)}
          >
            Link Volume
          </span>
          <IconButton
            icon={
              syncMainSpeakerVolume ? "mdi:check-circle" : "mdi:circle-outline"
            }
            size="x-small"
            onClick={() => setSyncMainSpeakerVolume(!syncMainSpeakerVolume)}
          />
        </div>
      )} />

      <GroupVolumeController
        config={{
          entity_id,
          speaker_group: {
            entities: speaker_group?.entities || [],
            entity_id: mainEntityId,
          },
        }}
        syncMainSpeaker={syncMainSpeakerVolume}
        showUngrouped={true}
      />
      <ViewHeader title="Change player" subtitle="Change which player you are controlling." />
      {enrichedEntities.length > 0 && enrichedEntities.map(renderPlayer)}
    </div>
  );
};
