import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import {
  CardContext,
  CardContextType,
  IconButton,
  Slider,
  useHass,
} from "@components";
import { getHass, getVolumeIcon } from "@utils";
import styled from "@emotion/styled";

const SpeakerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  border-radius: 8px 14px;
  background-color: var(--chip-background-color);
`;

const SpeakerName = styled.h4`
  margin: 0 8px 0 0;
  font-size: 14px;
  min-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ControlsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const SliderContainer = styled.div`
  flex: 1;
  min-width: 100px;
`;

const SpeakersList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

export type GroupSpeaker = {
  entity_id: string;
  name: string;
  volume: number;
  muted: boolean;
  isGrouped: boolean;
  isMainSpeaker: boolean;
};

export const GroupVolumeController = () => {
  const hass = useHass();
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const { entity_id, speaker_group } = config;

  const [playersLoading, setPlayersLoading] = useState<string[]>([]);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group?.entity_id || entity_id;
  const mainEntity = hass.states[mainEntityId];

  // Get all available speakers that can be grouped
  const availableSpeakers: GroupSpeaker[] = useMemo(() => {
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

  const handleToggleMute = useCallback((entityId: string, isMuted: boolean) => {
    getHass().callService("media_player", "volume_mute", {
      entity_id: entityId,
      is_volume_muted: !isMuted,
    });
  }, []);

  // Handle volume change for a speaker
  const handleVolumeChange = useCallback((entityId: string, volume: number) => {
    hass.callService("media_player", "volume_set", {
      entity_id: entityId,
      volume_level: volume,
    });
  }, []);

  const renderSpeaker = (speaker: GroupSpeaker) => {
    const { entity_id, name, volume, muted, isGrouped, isMainSpeaker } =
      speaker;
    const isLoading = playersLoading.includes(entity_id);
    const isDisabled = isLoading || (isMainSpeaker && !isGrouped);
    return (
      <SpeakerContainer>
        <SpeakerName>{name}</SpeakerName>
        <ControlsRow>
          <IconButton
            size="x-small"
            onClick={() => handleToggleMute(entity_id, muted)}
            icon={getVolumeIcon(volume, muted)}
          />
          <SliderContainer>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={volume}
              sliderSize="small"
              onChange={value => handleVolumeChange(entity_id, value)}
            />
          </SliderContainer>
          <IconButton
            size="x-small"
            onClick={() => handleToggleGroup(entity_id, isGrouped)}
            icon={isGrouped ? "mdi:link-off" : "mdi:speaker-multiple"}
            disabled={isDisabled}
          />
        </ControlsRow>
      </SpeakerContainer>
    );
  };

  return (
    <SpeakersList>
      {availableSpeakers
        .filter(speaker => speaker.isGrouped)
        .map(speaker => renderSpeaker(speaker))}
    </SpeakersList>
  );
};
