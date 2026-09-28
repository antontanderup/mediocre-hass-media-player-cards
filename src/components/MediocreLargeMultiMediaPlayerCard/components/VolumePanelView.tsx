import { useContext, useMemo, useCallback } from "preact/hooks";
import type {
  LinkedVolumePanelEntity,
  MediaPlayerEntity,
  MediocreMultiMediaPlayerCardConfig,
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
import {
  getCanOpenLinkedVolumePanel,
  getDeviceIcon,
  getHass,
  getLinkedVolumePanelSections,
  getVolumeIcon,
} from "@utils";
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
    margin: "4px 4px 0",
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

export type VolumePanelViewProps = {
  onClose: () => void;
};

export const VolumePanelView = memo<VolumePanelViewProps>(({ onClose }) => {
  const hass = useHass();
  const { selectedPlayer } = useSelectedPlayer();
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(CardContext);

  const mediaPlayer = selectedPlayer!;
  const sections = useMemo(
    () =>
      getLinkedVolumePanelSections(mediaPlayer, config.media_players, hass.states),
    [config.media_players, hass.states, mediaPlayer]
  );
  const canOpenLinkedVolumePanel = getCanOpenLinkedVolumePanel(
    mediaPlayer,
    config.media_players,
    hass.states
  );

  const availableSections = useMemo(
    () =>
      sections
        .map(section => ({
          ...section,
          entities: section.entities.filter(entity => !!hass.states[entity.entity_id]),
        }))
        .filter(section => section.entities.length > 0),
    [hass.states, sections]
  );

  return (
    <div css={styles.root}>
      <ViewHeader
        title="Volume Panel"
        renderAction={() => (
          <IconButton size="small" icon="mdi:close" onClick={onClose} />
        )}
      />
      {sections.length === 0 ? (
        <div css={styles.emptyState}>
          {canOpenLinkedVolumePanel
            ? "No linked volume entities are currently available."
            : "No linked volume endpoints are configured for the selected player."}
        </div>
      ) : availableSections.length === 0 ? (
        <div css={styles.emptyState}>
          None of the linked volume entities are currently available.
        </div>
      ) : (
        availableSections.map(section => (
          <div css={styles.group} key={section.key}>
            <div css={styles.sectionTitle}>
              {(hass.states[section.key] as MediaPlayerEntity | undefined)
                ?.attributes?.friendly_name ?? section.title}
            </div>
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

const VolumePanelEntityCard = ({
  entity,
  showStepButtons,
  useVolumeUpDownForSteps,
}: {
  entity: LinkedVolumePanelEntity;
  showStepButtons: boolean;
  useVolumeUpDownForSteps: boolean;
}) => {
  const hass = useHass();
  const player = hass.states[entity.entity_id] as MediaPlayerEntity | undefined;

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
  const isPowerOn = player?.state !== "off";

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
      entity_id: entity.entity_id,
    });
  }, [entity.entity_id, isPowerOn]);

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
