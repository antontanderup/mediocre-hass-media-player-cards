import { useContext, useState } from "preact/hooks";
import styled from "@emotion/styled";
import {
  useHass,
  GroupVolumeController,
  IconButton,
  GroupChipsController,
} from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";

const SpeakerGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const SpeakerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 16px;
  margin-right: 16px;
`;

const SyncContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  gap: 4px;
  opacity: 0.8;
  // Below positioning hack is probably going to come back to bite me but hey, it works
  position: absolute;
  right: 56px;
  top: 12px;
`;

const SyncText = styled.span`
  font-size: 12px;
`;

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
    <SpeakerGroupContainer>
      {mainEntity?.attributes?.group_members?.length > 1 && (
        <div>
          <SyncContainer>
            <SyncText
              onClick={() => setSyncMainSpeakerVolume(!syncMainSpeakerVolume)}
            >
              Link Volume
            </SyncText>
            <IconButton
              icon={
                syncMainSpeakerVolume
                  ? "mdi:check-circle"
                  : "mdi:circle-outline"
              }
              size="x-small"
              onClick={() => setSyncMainSpeakerVolume(!syncMainSpeakerVolume)}
            />
          </SyncContainer>
          <SpeakerList>
            <GroupVolumeController
              config={{
                entity_id,
                speaker_group,
              }}
              syncMainSpeaker={syncMainSpeakerVolume}
            />
          </SpeakerList>
        </div>
      )}
      <GroupChipsController
        config={{ entity_id, speaker_group }}
        showGrouped={false}
        layout={{ horizontalMargin: 16 }}
      />
    </SpeakerGroupContainer>
  );
};
