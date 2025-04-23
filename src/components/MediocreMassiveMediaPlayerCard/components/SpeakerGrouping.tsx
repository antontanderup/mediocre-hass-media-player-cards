import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import styled from "@emotion/styled";
import { Chip, useHass, GroupVolumeController, IconButton } from "@components";
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

const Chips = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 2px;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const SpeakerChip = styled(Chip)`
  &:first-child {
    margin-left: 16px;
  }
  &:last-child {
    margin-right: 16px;
  }
`;

export const SpeakerGrouping = () => {
  const hass = useHass();
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const { entity_id, speaker_group } = config;

  const [playersLoading, setPlayersLoading] = useState<string[]>([]);
  const [syncMainSpeakerVolume, setSyncMainSpeakerVolume] = useState(true);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group?.entity_id || entity_id;
  const mainEntity = hass.states[mainEntityId];

  // Get all available speakers that can be grouped
  const availableSpeakers = useMemo(() => {
    if (!speaker_group?.entities?.length) return [];

    return speaker_group.entities
      .filter(id => hass.states[id])
      .map(id => ({
        entity_id: id,
        name: hass.states[id].attributes.friendly_name,
        volume: hass.states[id].attributes.volume_level || 0,
        muted: hass.states[id].attributes.is_volume_muted || false,
        isGrouped: mainEntity?.attributes?.group_members?.includes(id) || false,
        isMainSpeaker:
          mainEntity?.attributes?.group_members?.[0] === id || false,
      }))
      .sort((a, b) => {
        if (a.entity_id === mainEntityId) return -1;
        if (b.entity_id === mainEntityId) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [hass.states, speaker_group]);

  // Handle joining/unjoining a speaker to/from the group
  const handleToggleGroup = useCallback(
    async (speakerId: string, isGrouped: boolean) => {
      if (playersLoading.includes(speakerId)) return;
      setPlayersLoading(prev => [...prev, speakerId]);
      try {
        const speaker = hass.states[speakerId];
        if (isGrouped) {
          // Remove from group
          await hass.callService("media_player", "unjoin", {
            entity_id: speakerId,
          });
        } else {
          // Add to group
          if (speaker.state === "off") {
            await hass.callService("media_player", "turn_on", {
              entity_id: speakerId,
            });
          }
          await hass.callService("media_player", "join", {
            entity_id: mainEntityId,
            group_members: [speakerId],
          });
        }
      } catch (e) {
        console.error(e);
      }
      setPlayersLoading(prev => prev.filter(id => id !== speakerId));
    },
    [mainEntityId, playersLoading]
  );

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
      <Chips>
        {availableSpeakers
          .filter(speaker => !speaker.isGrouped)
          .map(speaker => (
            <SpeakerChip
              key={speaker.entity_id}
              loading={playersLoading.includes(speaker.entity_id)}
              onClick={() =>
                handleToggleGroup(speaker.entity_id, speaker.isGrouped)
              }
              icon={speaker.isGrouped ? "mdi:close" : "mdi:plus"}
              iconPosition="right"
            >
              {speaker.name}
            </SpeakerChip>
          ))}
      </Chips>
    </SpeakerGroupContainer>
  );
};
