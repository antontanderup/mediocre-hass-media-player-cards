import type { MediocreMultiMediaPlayerCardConfig } from "@types";
import { css } from "@emotion/react";
import { useCallback, useContext, useMemo } from "preact/hooks";
import { CardContext, CardContextType } from "@components/CardContext";
import {
  Icon,
  IconButton,
  MassivePlaybackController,
  useHass,
  usePlayer,
  VolumeSlider,
} from "@components";
import {
  getCanOpenLinkedVolumePanel,
  getDeviceIcon,
  getHass,
  getVolumeIcon,
} from "@utils";
import { useActionProps } from "@hooks";
import { theme } from "@constants/theme";
import { memo } from "preact/compat";
import { NavigationRoute } from "../MediocreLargeMultiMediaPlayerCard";
import { useSelectedPlayer } from "@components/SelectedPlayerContext";

const styles = {
  root: css({
    padding: 16,
    gap: 24,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  }),
  massive: css({
    overflow: "hidden",
    width: "100%",
    height: "100%",
    padding: 0,
  }),
  massiveHeader: css({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "8px",
  }),
  title: css({
    margin: 0,
    fontSize: "18px",
    color: theme.colors.onCard,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginRight: "auto",
  }),
  volumeRoot: css({
    display: "flex",
    alignItems: "center",
    flex: 1,
    maxHeight: "36px",
    gap: "12px",
    justifySelf: "center",
    width: "100%",
    maxWidth: 600,
  }),
  buttonMuted: css({
    opacity: 0.8,
  }),
};

export type MassiveViewViewProps = {
  setNavigationRoute: (route: NavigationRoute) => void;
  navigationRoute: NavigationRoute;
};

export const MassiveViewView = memo<MassiveViewViewProps>(
  ({ setNavigationRoute, navigationRoute }: MassiveViewViewProps) => {
    const hass = useHass();
    const { selectedPlayer } = useSelectedPlayer();

    const mediaPlayer = selectedPlayer!;

    const { rootElement, config } =
      useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
        CardContext
      );

    const {
      entity_id,
      attributes: {
        friendly_name: friendlyName,
        icon,
        device_class: deviceClass,
        volume_level: volumeLevel,
        is_volume_muted: isVolumeMuted,
      },
    } = usePlayer();

    const volume = volumeLevel ?? 0;
    const volumeMuted = isVolumeMuted ?? false;

    // Handle mute toggle
    const handleToggleMute = useCallback(() => {
      getHass().callService("media_player", "volume_mute", {
        entity_id,
        is_volume_muted: !volumeMuted,
      });
    }, [volumeMuted, entity_id]);

    const VolumeIcon = useMemo(
      () => getVolumeIcon(volume, volumeMuted),
      [volume, volumeMuted]
    );

    const groupMembers =
      hass.states[mediaPlayer.speaker_group_entity_id ?? mediaPlayer.entity_id]
        ?.attributes?.group_members;
    const canOpenLinkedVolumePanel = getCanOpenLinkedVolumePanel(
      mediaPlayer,
      config.media_players,
      hass.states
    );
    const mdiIcon = getDeviceIcon({ icon, deviceClass });

    const moreInfoButtonProps = useActionProps({
      rootElement,
      actionConfig: {
        tap_action: {
          action: "more-info",
        },
        entity: mediaPlayer.entity_id,
      },
    });

    const togglePower = useCallback(() => {
      getHass().callService("media_player", "toggle", {
        entity_id,
      });
    }, [entity_id]);

    const handleOnClick = useCallback(() => {
      if (navigationRoute === "speaker-grouping") {
        return setNavigationRoute("massive");
      }
      return setNavigationRoute("speaker-grouping");
    }, [setNavigationRoute, navigationRoute]);

    if (config.size === "compact") return null;
    return (
      <div css={styles.root}>
        {!config.options?.hide_selected_player_header && (
          <div
            css={styles.massiveHeader}
            id="mmpc-multi-media-player-card-massive-view-header"
          >
            <Icon size={"small"} icon={mdiIcon} />
            <span css={styles.title}>
              {mediaPlayer.name ?? friendlyName}
              {groupMembers?.length > 1 && (
                <span> +{groupMembers.length - 1}</span>
              )}
            </span>
            <IconButton
              size="small"
              {...moreInfoButtonProps}
              icon="mdi:dots-vertical"
            />
          </div>
        )}
        <MassivePlaybackController
          css={styles.massive}
          artworkButtonProps={{ onClick: handleOnClick }}
        >
          <div css={styles.volumeRoot}>
            <IconButton
              css={volumeMuted ? styles.buttonMuted : {}}
              size="small"
              onClick={handleToggleMute}
              icon={VolumeIcon}
            />
            <VolumeSlider
              entityId={
                mediaPlayer.speaker_group_entity_id ?? mediaPlayer.entity_id
              }
              syncGroupChildren={true}
              sliderSize={"small"}
              showStepButtons={
                config.options?.show_volume_step_buttons ?? false
              }
              useVolumeUpDownForSteps={
                config.options?.use_volume_up_down_for_step_buttons ?? false
              }
            />
            <VolumeTrailingButton
              launchFrom={
                mediaPlayer.linked_volume_panel?.launch_from ?? "disabled"
              }
              canOpenLinkedVolumePanel={canOpenLinkedVolumePanel}
              icon={
                config.options?.ui?.volume_bar?.trailing_volume_button_icon?.trim() ||
                "mdi:volume-source"
              }
              onOpenLinkedVolumePanel={() => setNavigationRoute("volume-panel")}
              onPower={togglePower}
            />
          </div>
        </MassivePlaybackController>
      </div>
    );
  }
);

const VolumeTrailingButton = ({
  launchFrom,
  canOpenLinkedVolumePanel,
  icon,
  onOpenLinkedVolumePanel,
  onPower,
}: {
  launchFrom: "disabled" | "trailing_volume_bar_button";
  canOpenLinkedVolumePanel: boolean;
  icon: string;
  onOpenLinkedVolumePanel: () => void;
  onPower: () => void;
}) => {
  if (
    launchFrom === "trailing_volume_bar_button" &&
    canOpenLinkedVolumePanel
  ) {
    return (
      <IconButton size="small" onClick={onOpenLinkedVolumePanel} icon={icon} />
    );
  }

  return <IconButton size="small" onClick={onPower} icon="mdi:power" />;
};
