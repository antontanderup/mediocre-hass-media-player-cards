import { useCallback, useMemo, useState } from "preact/hooks";
import type {
  CommonMediocreMediaPlayerCardConfig,
  MediaPlayerConfigEntity,
} from "@types";
import { IconButton, useHass, VolumeSlider } from "@components";
import { getHass, getVolumeIcon } from "@utils";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  speakersTable: css({
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  }),
  speakerRow: css({
    width: "100%",
    height: "32px",
  }),
  nameCell: css({
    color: theme.colors.onCard,
    paddingRight: "8px",
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  nameCellMainSpeaker: css({
    fontWeight: 500,
  }),
  controlsCell: css({
    padding: "0px 4px",
  }),
  buttonCell: css({
    width: "28px",
    whiteSpace: "nowrap",
  }),
  controlsContainer: css({
    display: "flex",
    alignItems: "center",
    width: "100%",
  }),
};

export type GroupSpeaker = {
  entity_id: string;
  name: string;
  volume: number;
  muted: boolean;
  isGrouped: boolean;
  isOff: boolean;
  isMainSpeaker: boolean;
};

export type GroupVolumeControllerProps = {
  config: Pick<
    CommonMediocreMediaPlayerCardConfig,
    "speaker_group" | "entity_id"
  > &
    Partial<CommonMediocreMediaPlayerCardConfig>;
  syncMainSpeaker: boolean; // Wheter the main speaker will affect the volume of the group
  className?: string;
};

export const GroupVolumeController = ({
  config,
  syncMainSpeaker,
  className,
}: GroupVolumeControllerProps) => {
  const { speaker_group, entity_id } = config;

  const hass = useHass();

  const [playersLoading, setPlayersLoading] = useState<string[]>([]);

  // Use the specified entity_id for the group or fall back to the main entity_id
  const mainEntityId = speaker_group?.entity_id || entity_id;
  const mainEntity = hass.states[mainEntityId];

  // Get all available speakers that can be grouped
  const availableSpeakers: GroupSpeaker[] = useMemo(() => {
    if (!speaker_group?.entities?.length && !mainEntity) return [];

    const speakerEntities = [...(speaker_group?.entities || [])];

    // Add main entity if it exists and isn't already in the list
    if (
      mainEntity &&
      !speakerEntities.find(
        entity =>
          (typeof entity === "string" ? entity : entity.entity) === mainEntityId
      )
    ) {
      speakerEntities.push(mainEntityId);
    }

    const getEntityId = (entity: MediaPlayerConfigEntity) =>
      typeof entity === "string" ? entity : entity.entity;

    return speakerEntities
      .filter(entity => hass.states[getEntityId(entity)])
      .map(entity => ({
        entity_id: getEntityId(entity),
        name:
          typeof entity !== "string" && !!entity.name
            ? entity.name
            : (hass.states[getEntityId(entity)].attributes.friendly_name ??
              getEntityId(entity)),
        volume: hass.states[getEntityId(entity)].attributes.volume_level || 0,
        muted:
          hass.states[getEntityId(entity)].attributes.is_volume_muted || false,
        isOff: hass.states[getEntityId(entity)].state === "off",
        isGrouped:
          mainEntity?.attributes?.group_members?.includes(
            getEntityId(entity)
          ) || false,
        isMainSpeaker:
          mainEntity?.attributes?.group_members?.[0] === getEntityId(entity) ||
          false,
      }))
      .sort((a, b) => {
        if (a.entity_id === mainEntityId) return -1;
        if (b.entity_id === mainEntityId) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [hass.states, speaker_group, mainEntityId, mainEntity]);

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

  const handleToggleOn = useCallback((entityId: string) => {
    getHass().callService("media_player", "turn_on", { entity_id: entityId });
  }, []);

  const renderSpeaker = (
    speaker: GroupSpeaker,
    _index: number,
    _groupedSpeakers: GroupSpeaker[]
  ) => {
    const { entity_id, name, volume, muted, isGrouped, isMainSpeaker, isOff } =
      speaker;
    const isLoading = playersLoading.includes(entity_id);
    const isDisabled = isLoading || (isMainSpeaker && !isGrouped);

    return (
      <tr css={styles.speakerRow} key={entity_id}>
        <td
          css={[styles.nameCell, isMainSpeaker && styles.nameCellMainSpeaker]}
        >
          {name}
        </td>
        {isOff ? (
          <td css={styles.buttonCell}>
            <IconButton
              size="x-small"
              onClick={() => handleToggleOn(entity_id)}
              icon="mdi:power"
              disabled={isDisabled}
            />
          </td>
        ) : (
          <td css={styles.buttonCell}>
            <IconButton
              size="x-small"
              onClick={() => handleToggleMute(entity_id, muted)}
              icon={getVolumeIcon(volume, muted)}
            />
          </td>
        )}
        <td css={styles.controlsCell}>
          <div css={styles.controlsContainer}>
            <VolumeSlider
              entityId={entity_id}
              syncGroupChildren={isMainSpeaker && syncMainSpeaker}
              sliderSize={"small"}
              showStepButtons={
                config.options?.show_volume_step_buttons ?? false
              }
              useVolumeUpDownForSteps={
                config.options?.use_volume_up_down_for_step_buttons ?? false
              }
            />
          </div>
        </td>
        <td css={styles.buttonCell}>
          <IconButton
            size="x-small"
            onClick={() => handleToggleGroup(entity_id, isGrouped)}
            icon={isGrouped ? "mdi:close" : "mdi:plus"}
            disabled={isDisabled}
          />
        </td>
      </tr>
    );
  };

  return (
    <div className={className}>
      <table css={styles.speakersTable}>
        <tbody>
          {availableSpeakers
            .filter(speaker => speaker.isGrouped)
            .map((speaker, index, filteredSpeakers) =>
              renderSpeaker(speaker, index, filteredSpeakers)
            )}
        </tbody>
      </table>
    </div>
  );
};
