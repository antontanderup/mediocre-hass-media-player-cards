import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import styled from "@emotion/styled";
import { Slider } from "../../Slider";
import { IconButton } from "../../IconButton";
import { CardContext, CardContextType } from "../../../utils";
import { Fragment } from "preact/jsx-runtime";
import { Icon } from "../../Icon";
import { MediocreMediaPlayerCardConfig } from "../../MediaPlayerCommon";

const SpeakerGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SpeakerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 16px;
  margin-right: 16px;
`;

const SpeakerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SpeakerName = styled.div<{ isMaster?: boolean }>`
  font-size: 13px;
  flex: 1;
  ${(props) => (props.isMaster ? "font-weight: 500;" : "")}
  color: var(--primary-text-color);
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
`;

const Chips = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const Chip = styled.div<{ $loading: boolean }>`
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  line-height: 32px;
  padding: 0 12px;
  border-radius: 16px;
  color: var(--card-background-color);
  background-color: var(--primary-text-color);
  margin-right: 5px;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  text-wrap: nowrap;
  cursor: pointer;
  opacity: ${(props) => (props.$loading ? 0.3 : 0.8)};
  &:first-child {
    margin-left: 16px;
  }
  &:last-child {
    margin-right: 16px;
  }
`;

export const SpeakerGrouping = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const { entity_id, speaker_group } = config;

  const [playersLoading, setPlayersLoading] = useState<string[]>([]);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group?.entity_id || entity_id;
  const mainEntity = hass.states[mainEntityId];

  // Get all available speakers that can be grouped
  const availableSpeakers = useMemo(() => {
    if (!speaker_group?.entities?.length) return [];

    return speaker_group.entities
      .filter((id) => hass.states[id])
      .map((id) => ({
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
      setPlayersLoading((prev) => [...prev, speakerId]);
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
      setPlayersLoading((prev) => prev.filter((id) => id !== speakerId));
    },
    [mainEntityId, playersLoading]
  );

  // Handle volume change for a speaker
  const handleVolumeChange = useCallback((entityId: string, volume: number) => {
    hass.callService("media_player", "volume_set", {
      entity_id: entityId,
      volume_level: volume,
    });
  }, []);

  return (
    <SpeakerGroupContainer>
      {mainEntity?.attributes?.group_members?.length > 1 && (
        <Fragment>
          <SpeakerList>
            {availableSpeakers
              .filter((speaker) => speaker.isGrouped)
              .map((speaker) => (
                <SpeakerItem key={speaker.entity_id}>
                  <IconButton
                    size="x-small"
                    onClick={() =>
                      handleToggleGroup(speaker.entity_id, speaker.isGrouped)
                    }
                    icon={"mdi:link-variant-off"}
                  />
                  <SpeakerName isMaster={speaker.isMainSpeaker}>
                    {speaker.name} {speaker.isMainSpeaker && "(Master)"}
                  </SpeakerName>
                  {speaker.isGrouped && (
                    <VolumeControl>
                      <Icon size="x-small" icon={"mdi:volume-high"} />
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={speaker.volume}
                        thumbSize="small"
                        onChange={(value) =>
                          handleVolumeChange(speaker.entity_id, value)
                        }
                      />
                    </VolumeControl>
                  )}
                </SpeakerItem>
              ))}
          </SpeakerList>
        </Fragment>
      )}
      <Chips>
        {availableSpeakers
          .filter((speaker) => !speaker.isGrouped)
          .map((speaker) => (
            <Chip
              key={speaker.entity_id}
              $loading={playersLoading.includes(speaker.entity_id)}
              onClick={() =>
                handleToggleGroup(speaker.entity_id, speaker.isGrouped)
              }
            >
              {speaker.name}
              {speaker.isGrouped && <Icon size="x-small" icon={"mdi:close"} />}
              {!speaker.isGrouped && <Icon size="x-small" icon={"mdi:plus"} />}
            </Chip>
          ))}
      </Chips>
    </SpeakerGroupContainer>
  );
};
