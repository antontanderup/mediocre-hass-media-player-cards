import { useContext, useMemo, useCallback } from "preact/hooks";
import type {
  MediaPlayerEntity,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
  VolumePanelEntity as VolumePanelEntityConfig,
} from "@types";
import {
  CardContext,
  CardContextType,
  Icon,
  IconButton,
  VolumeSlider,
  useHass,
} from "@components";
import { css } from "@emotion/react";
import { getDeviceIcon, getHass, getVolumeIcon } from "@utils";
import { theme } from "@constants";
import { ViewHeader } from "./ViewHeader";
import { memo } from "preact/compat";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    gap: 16,
    overflowY: "auto",
    height: "100%",
    padding: 16,
  }),
  group: css({
    display: "flex",
    flexDirection: "column",
    gap: 10,
  }),
  sectionTitle: css({
    fontSize: 15,
    fontWeight: 600,
    color: theme.colors.onCard,
    margin: "0 4px",
  }),
  entityCard: css({
    display: "flex",
    flexDirection: "column",
    gap: 8,
    borderRadius: 16,
    padding: "10px 12px",
    backgroundColor: "var(--ha-card-background, rgba(127, 127, 127, 0.06))",
    borderWidth: "var(--ha-card-border-width, 1px)",
    borderColor: "var(--ha-card-border-color,var(--divider-color,#e0e0e0))",
    borderStyle: "var(--ha-card-border-style, solid)",
  }),
  entityHeader: css({
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  }),
  entityInfo: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    minWidth: 0,
    flex: 1,
  }),
  entityTitle: css({
    fontSize: 15,
    fontWeight: 600,
    color: theme.colors.onCard,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  entityMeta: css({
    fontSize: 12,
    color: theme.colors.onCardMuted,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  controlsRow: css({
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
  }),
  muteButtonMuted: css({
    opacity: 0.8,
  }),
  emptyState: css({
    fontSize: 14,
    color: theme.colors.onCardMuted,
    lineHeight: 1.4,
  }),
};

export const VolumePanelView = memo(() => {
  const hass = useHass();
  const { selectedPlayer } = useSelectedPlayer();
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(CardContext);

  const mediaPlayer = selectedPlayer!;
  const mainEntityId = mediaPlayer.speaker_group_entity_id ?? mediaPlayer.entity_id;
  const groupState = hass.states[mainEntityId] as MediaPlayerEntity | undefined;
  const groupMembers = groupState?.attributes?.group_members ?? [];
  const isGrouped = (groupState?.attributes?.group_members?.length ?? 0) > 1;
  const volumePanel = mediaPlayer.volume_panel;
  const shouldBlockForGrouping =
    (volumePanel?.show_when ?? "grouped") !== "always" && !isGrouped;

  const groupedPlayers = useMemo(() => {
    const runtimeOrder = [mainEntityId, ...groupMembers.filter(id => id !== mainEntityId)];
    const playersByRuntimeId = new Map<string, MediocreMultiMediaPlayer>();

    config.media_players.forEach(player => {
      playersByRuntimeId.set(
        player.speaker_group_entity_id ?? player.entity_id,
        player.entity_id === mediaPlayer.entity_id ? mediaPlayer : player
      );
    });

    return runtimeOrder
      .map(runtimeEntityId => playersByRuntimeId.get(runtimeEntityId))
      .filter(Boolean) as MediocreMultiMediaPlayer[];
  }, [config.media_players, groupMembers, mainEntityId, mediaPlayer]);

  const playerSections = useMemo(() => {
    const playersToRender = isGrouped ? groupedPlayers : [mediaPlayer];

    return playersToRender
      .map(player => {
        const entities = getVolumePanelEntities(player).filter(
          entity => !!hass.states[entity.entity_id]
        );
        if (entities.length === 0) return null;

        const playerState = hass.states[player.entity_id] as
          | MediaPlayerEntity
          | undefined;

        return {
          key: player.entity_id,
          title: player.name ?? playerState?.attributes?.friendly_name ?? player.entity_id,
          entities,
        };
      })
      .filter(Boolean) as {
      key: string;
      title: string;
      entities: VolumePanelEntityConfig[];
    }[];
  }, [groupedPlayers, hass.states, isGrouped, mediaPlayer]);

  return (
    <div css={styles.root}>
      <ViewHeader
        title="Group Volume"
        subtitle={
          shouldBlockForGrouping
            ? "This panel is available when the selected player is grouped."
            : "The selected player is shown first, followed by the other grouped players."
        }
      />
      {shouldBlockForGrouping ? (
        <div css={styles.emptyState}>
          Switch to a grouped player, or set <code>show_when: always</code> on
          the volume panel if you want these controls available at all times.
        </div>
      ) : playerSections.length === 0 ? (
        <div css={styles.emptyState}>
          None of the configured volume panel entities are currently available.
        </div>
      ) : (
        playerSections.map(section => (
          <div css={styles.group} key={section.key}>
            <div css={styles.sectionTitle}>{section.title}</div>
            {section.entities.map(entity => (
              <VolumePanelEntityCard
                key={entity.entity_id}
                entity={entity}
                showStepButtons={config.options?.show_volume_step_buttons ?? false}
                useVolumeUpDownForSteps={
                  config.options?.use_volume_up_down_for_step_buttons ?? false
                }
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
});

const getVolumePanelEntities = (
  player: MediocreMultiMediaPlayer
): VolumePanelEntityConfig[] => {
  if (!player.volume_panel) {
    return [
      {
        entity_id: player.speaker_group_entity_id ?? player.entity_id,
        ...(player.name ? { name: player.name } : {}),
      },
    ];
  }

  const directEntities = player.volume_panel.entities ?? [];
  const legacyEntities =
    player.volume_panel.groups?.flatMap(group => group.entities) ?? [];

  const configuredEntities =
    directEntities.length > 0 ? directEntities : legacyEntities;

  if (configuredEntities.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  return configuredEntities.filter(entity => {
    if (seen.has(entity.entity_id)) return false;
    seen.add(entity.entity_id);
    return true;
  });
};

const VolumePanelEntityCard = ({
  entity,
  showStepButtons,
  useVolumeUpDownForSteps,
}: {
  entity: VolumePanelEntityConfig;
  showStepButtons: boolean;
  useVolumeUpDownForSteps: boolean;
}) => {
  const hass = useHass();
  const player = hass.states[entity.entity_id] as MediaPlayerEntity | undefined;

  const powerEntityId = entity.power_entity_id ?? entity.entity_id;
  const powerEntity = hass.states[powerEntityId] as MediaPlayerEntity | undefined;

  const volume = player?.attributes?.volume_level ?? 0;
  const isVolumeMuted = player?.attributes?.is_volume_muted ?? false;
  const volumeIcon = getVolumeIcon(volume, isVolumeMuted);
  const volumePercent = Math.round(volume * 100);
  const isOff = player?.state === "off";
  const displayName =
    entity.name ?? player?.attributes?.friendly_name ?? entity.entity_id;
  const displayIcon =
    entity.icon ??
    getDeviceIcon({
      icon: player?.attributes?.icon,
      deviceClass: player?.attributes?.device_class,
    });
  const subtitle = isOff
    ? "Off"
    : `${volumePercent}%${isVolumeMuted ? " · Muted" : ""}`;
  const showPowerButton = entity.show_power === true;
  const isPowerOn = (powerEntity?.state ?? player?.state) !== "off";

  const handleToggleMute = useCallback(() => {
    if (!player) return;
    getHass().callService("media_player", "volume_mute", {
      entity_id: entity.entity_id,
      is_volume_muted: !isVolumeMuted,
    });
  }, [entity.entity_id, isVolumeMuted, player]);

  const handleTogglePower = useCallback(() => {
    const service = isPowerOn ? "turn_off" : "turn_on";
    getHass().callService("media_player", service, {
      entity_id: powerEntityId,
    });
  }, [isPowerOn, powerEntityId]);

  if (!player) return null;

  return (
    <div css={styles.entityCard}>
      <div css={styles.entityHeader}>
        <Icon icon={displayIcon} size="x-small" />
        <div css={styles.entityInfo}>
          <div css={styles.entityTitle}>{displayName}</div>
          {subtitle ? <div css={styles.entityMeta}>{subtitle}</div> : null}
        </div>
        {showPowerButton ? (
          <IconButton
            size="x-small"
            icon="mdi:power"
            selected={isPowerOn}
            onClick={handleTogglePower}
          />
        ) : null}
      </div>
      <div css={styles.controlsRow}>
        <IconButton
          css={isVolumeMuted ? styles.muteButtonMuted : {}}
          size="x-small"
          onClick={handleToggleMute}
          icon={volumeIcon}
          disabled={isOff}
        />
        <VolumeSlider
          entityId={entity.entity_id}
          syncGroupChildren={false}
          sliderSize="small"
          showStepButtons={showStepButtons}
          useVolumeUpDownForSteps={useVolumeUpDownForSteps}
        />
      </div>
    </div>
  );
};
