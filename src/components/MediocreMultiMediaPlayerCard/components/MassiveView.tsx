import type {
  MediocreMassiveMediaPlayerCardConfig,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { css } from "@emotion/react";
import { useCallback, useContext, useMemo } from "preact/hooks";
import {
  CardContext,
  CardContextProvider,
  CardContextType,
} from "@components/CardContext";
import { MediocreMassiveMediaPlayerCard } from "@components/MediocreMassiveMediaPlayerCard";
import { Icon, IconButton, Slider, useHass, usePlayer } from "@components";
import { getDeviceIcon, getHass, getVolumeIcon, setVolume } from "@utils";
import { useActionProps } from "@hooks";
import { theme } from "@constants/theme";
import { memo } from "preact/compat";

const styles = {
  root: css({
    padding: 16,
    display: "grid",
    gap: 24,
    gridTemplateRows: "auto 1fr auto",
    gridTemplateColumns: "1fr",
  }),
  massive: css({
    overflow: "hidden",
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
    marginTop: "auto",
    gap: "8px",
    justifySelf: "center",
    width: "100%",
    maxWidth: 600,
  }),
  buttonMuted: css({
    opacity: 0.8,
  }),
};

export type MassiveViewViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const MassiveViewView = memo<MassiveViewViewProps>(
  ({ mediaPlayer, height }: MassiveViewViewProps) => {
    const hass = useHass();

    const { rootElement } =
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

    const handleVolumeChange = useCallback(
      (volume: number) => {
        // Use setVolume utility, with sync if this is the main speaker
        setVolume(
          mediaPlayer.speaker_group_entity_id ?? mediaPlayer.entity_id,
          volume,
          true
        );
      },
      [mediaPlayer]
    );

    // Handle mute toggle
    const handleToggleMute = useCallback(() => {
      getHass().callService("media_player", "volume_mute", {
        entity_id,
        is_volume_muted: !volumeMuted,
      });
    }, [volumeMuted]);

    const VolumeIcon = useMemo(
      () => getVolumeIcon(volume, volumeMuted),
      [volume, volumeMuted]
    );

    const groupMembers =
      hass.states[mediaPlayer.speaker_group_entity_id ?? mediaPlayer.entity_id]
        ?.attributes?.group_members;
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

    const massiveConfig: MediocreMassiveMediaPlayerCardConfig = useMemo(() => {
      return {
        ...mediaPlayer,
        mode: "multi",
        type: "custom:mediocre-massive-media-player-card",
      };
    }, [mediaPlayer]);

    return (
      <div css={styles.root} style={{ height }}>
        <div css={styles.massiveHeader}>
          <Icon size={"small"} icon={mdiIcon} />
          <span css={styles.title}>
            {friendlyName}
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
        <CardContextProvider rootElement={rootElement} config={massiveConfig}>
          <MediocreMassiveMediaPlayerCard css={styles.massive} />
        </CardContextProvider>
        <div css={styles.volumeRoot}>
          <IconButton
            css={volumeMuted ? styles.buttonMuted : {}}
            size="small"
            onClick={handleToggleMute}
            icon={VolumeIcon}
          />
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={volume}
            sliderSize={"large"}
            getThumbLabel={(value) => `${Math.round(value * 100)}%`}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    );
  }
);
