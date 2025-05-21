import { useContext, useState } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
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
};

export const SpeakerGrouping = () => {
  const hass = useHass();
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const { entity_id, speaker_group } = config;

  const [syncMainSpeakerVolume, setSyncMainSpeakerVolume] = useState(true);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group?.entity_id || entity_id;
  const mainEntity = hass.states[mainEntityId];

  return (
    <div css={styles.speakerGroupContainer}>
      {mainEntity?.attributes?.group_members?.length > 1 && (
        <Fragment>
          <div css={styles.titleRow}>
            <h3 css={styles.groupTitle}>Grouped Speakers</h3>
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
          </div>
          <div css={styles.groupedSpeakers}>
            <GroupVolumeController
              config={{
                entity_id,
                speaker_group,
              }}
              syncMainSpeaker={syncMainSpeakerVolume}
            />
          </div>
        </Fragment>
      )}
      <h3 css={styles.groupTitle}>Add speakers to group</h3>
      <GroupChipsController
        config={{ entity_id, speaker_group }}
        showGrouped={false}
        layout={{ horizontalMargin: 16 }}
      />
    </div>
  );
};
