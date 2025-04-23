import { Chip, useHass } from "@components";
import styled from "@emotion/styled";
import { CommonMediocreMediaPlayerCardConfig } from "@types";
import { FC, useCallback, useMemo, useState } from "preact/compat";

const Chips = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  justify-content: flex-start;
  overflow-x: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SpeakerChip = styled(Chip)<{ $horizontalMargin?: number }>`
  &:first-child {
    margin-left: ${props => props.$horizontalMargin ?? 0}px;
  }
  &:last-child {
    margin-right: ${props => props.$horizontalMargin ?? 0}px;
  }
`;

export type GroupChipsControllerProps = {
  config: Pick<
    CommonMediocreMediaPlayerCardConfig,
    "speaker_group" | "entity_id"
  >;
  showGrouped: boolean;
  layout?: {
    horizontalMargin?: number;
  };
};

export const GroupChipsController: FC<GroupChipsControllerProps> = ({
  config,
  showGrouped,
  layout,
}) => {
  const hass = useHass();

  const { entity_id, speaker_group } = config;

  const [playersLoading, setPlayersLoading] = useState<string[]>([]);

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
      .filter(speaker => {
        if (showGrouped) return true;
        return !speaker.isGrouped;
      })
      .sort((a, b) => {
        if (a.entity_id === mainEntityId) return -1;
        if (b.entity_id === mainEntityId) return 1;
        return a.name.localeCompare(b.name);
      })
      .sort((a, b) => {
        if (a.isGrouped && !b.isGrouped) return -1;
        if (!a.isGrouped && b.isGrouped) return 1;
        return 0;
      });
  }, [hass.states, speaker_group, showGrouped]);

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
    <Chips>
      {availableSpeakers.map(speaker => (
        <SpeakerChip
          key={speaker.entity_id}
          loading={playersLoading.includes(speaker.entity_id)}
          onClick={() =>
            handleToggleGroup(speaker.entity_id, speaker.isGrouped)
          }
          icon={speaker.isGrouped ? "mdi:close" : "mdi:plus"}
          iconPosition="right"
          $horizontalMargin={layout?.horizontalMargin}
        >
          {speaker.name}
        </SpeakerChip>
      ))}
    </Chips>
  );
};
