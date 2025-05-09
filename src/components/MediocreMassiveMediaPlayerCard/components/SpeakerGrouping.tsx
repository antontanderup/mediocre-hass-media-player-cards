import { useContext, useState } from "preact/hooks";
import {
  useHass,
  GroupVolumeController,
  IconButton,
  GroupChipsController,
} from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { css } from "@emotion/react";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  }),
  speakerList: css({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginLeft: "16px",
    marginRight: "16px",
  }),
  syncContainer: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: "4px",
    opacity: 0.8,
    position: "absolute", // Positioning hack is probably going to come back to bite me but hey, it works
    right: "56px",
    top: "12px",
  }),
  syncText: css({
    fontSize: "12px",
  }),
};

export const SpeakerGrouping = () => {
  const hass = useHass();
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const { entity_id, speaker_group } = config;

  const [syncMainSpeakerVolume, setSyncMainSpeakerVolume] = useState(true);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group?.entity_id || entity_id;
  const mainEntity = hass.states[mainEntityId];

  return (
    <div css={styles.root}>
      {mainEntity?.attributes?.group_members?.length > 1 && (
        <div>
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
          <div css={styles.speakerList}>
            <GroupVolumeController
              config={{
                entity_id,
                speaker_group,
              }}
              syncMainSpeaker={syncMainSpeakerVolume}
            />
          </div>
        </div>
      )}
      <GroupChipsController
        config={{ entity_id, speaker_group }}
        showGrouped={false}
        layout={{ horizontalMargin: 16 }}
      />
    </div>
  );
};
