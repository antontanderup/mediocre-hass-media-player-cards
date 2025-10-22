import { useCallback, useContext, useMemo } from "preact/hooks";
import {
  CardContext,
  CardContextType,
  IconButton,
  Slider,
  usePlayer,
} from "@components";
import { Fragment } from "preact/jsx-runtime";
import { getHass, getVolumeIcon, setVolume } from "@utils";
import { css } from "@emotion/react";
import { MediocreMediaPlayerCardConfig } from "@types";

const styles = {
  root: css({
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    width: "100%",
    gap: "4px",
  }),
};

export const VolumeSlider = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const { speaker_group } = config;

  const player = usePlayer();
  const entity_id = player.entity_id;
  const volume = player.attributes?.volume_level ?? 0;
  const volumeMuted = player.attributes?.is_volume_muted ?? false;

  // Handle volume change
  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      // Set the volume level
      setVolume(speaker_group?.entity_id ?? entity_id, newVolume, true);
    },
    [entity_id, speaker_group]
  );

  const handleVolumeStepChange = useCallback(
    (stepDirection: "increment" | "decrement") => {
      const serviceName =
        stepDirection === "increment" ? "volume_up" : "volume_down";
      getHass().callService("media_player", serviceName, {
        entity_id: entity_id,
      });
    },
    [entity_id]
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

  return (
    <div css={styles.root}>
      <IconButton size="x-small" onClick={handleToggleMute} icon={VolumeIcon} />
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={volume}
        sliderSize={"small"}
        showStepButtons={config.options?.show_volume_step_buttons ?? false}
        onStepButtonClick={
          config.options?.use_volume_up_down_for_step_buttons
            ? handleVolumeStepChange
            : undefined
        }
        getThumbLabel={value => `${Math.round(value * 100)}%`}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export const VolumeTrigger = ({
  sliderVisible,
  setSliderVisible,
}: {
  sliderVisible: boolean;
  setSliderVisible: (newValue: boolean) => void;
}) => {
  const player = usePlayer();

  const volume = player.attributes?.volume_level ?? 0;
  const volumeMuted = player.attributes?.is_volume_muted ?? false;
  const volumeIcon = getVolumeIcon(volume, volumeMuted);

  return (
    <Fragment>
      {!sliderVisible ? (
        <IconButton
          size="x-small"
          onClick={() => setSliderVisible(true)}
          icon={volumeIcon}
        />
      ) : (
        <IconButton
          size="x-small"
          onClick={() => setSliderVisible(false)}
          icon={"mdi:chevron-left"}
        />
      )}
    </Fragment>
  );
};
