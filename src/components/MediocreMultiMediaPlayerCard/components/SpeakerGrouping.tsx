import { useContext, useState } from "preact/hooks";
import type {
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { Fragment } from "preact/jsx-runtime";
import {
  CardContext,
  CardContextType,
  useHass,
  GroupVolumeController,
  IconButton,
} from "@components";
import { GroupChipsController } from "@components/GroupChipsController";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  speakerGroupContainer: css({
    display: "flex",
    flexDirection: "column",
    paddingTop: "12px",
    paddingBottom: "16px",
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
};

export type SpeakerGroupingProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
};

export const SpeakerGrouping = ({ mediaPlayer }: SpeakerGroupingProps) => {
  const hass = useHass();
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const { speaker_group } = config;
  const { entity_id, speaker_group_entity_id } = mediaPlayer;

  const [syncMainSpeakerVolume, setSyncMainSpeakerVolume] = useState(true);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group_entity_id || entity_id;

  return (
    <div css={styles.speakerGroupContainer}>
      <div css={styles.titleRow}>
        <h3 css={styles.groupTitle}>Speaker Grouping</h3>
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
      </div>
      <div css={styles.groupedSpeakers}>
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
      </div>
    </div>
  );
};
