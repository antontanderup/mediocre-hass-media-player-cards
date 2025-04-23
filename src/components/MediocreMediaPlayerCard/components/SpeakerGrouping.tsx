import { useContext, useState } from "preact/hooks";
import styled from "@emotion/styled";
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

const SpeakerGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-bottom: 16px;
  border-top: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  gap: 12px;
`;

const GroupTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: var(--primary-text-color);
  margin: 0px 16px;
`;

const SyncContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  gap: 4px;
  margin-right: 19px;
`;

const SyncText = styled.span`
  font-size: 12px;
  color: var(--secondary-text-color);
`;

const GroupedSpeakers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 16px;
  margin-right: 16px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
`;

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
    <SpeakerGroupContainer>
      {mainEntity?.attributes?.group_members?.length > 1 && (
        <Fragment>
          <TitleRow>
            <GroupTitle>Grouped Speakers</GroupTitle>
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
          </TitleRow>
          <GroupedSpeakers>
            <GroupVolumeController
              config={{
                entity_id,
                speaker_group,
              }}
              syncMainSpeaker={syncMainSpeakerVolume}
            />
          </GroupedSpeakers>
        </Fragment>
      )}
      <GroupTitle>Add speakers to group</GroupTitle>
      <GroupChipsController
        config={{ entity_id, speaker_group }}
        showGrouped={false}
        layout={{ horizontalMargin: 16 }}
      />
    </SpeakerGroupContainer>
  );
};
