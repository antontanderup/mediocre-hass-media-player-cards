import { useCallback, useMemo } from "preact/hooks";
import styled from "@emotion/styled";
import { IconButton, Slider, usePlayer } from "@components";
import { Fragment } from "preact/jsx-runtime";
import { getHass, getVolumeIcon } from "@utils";

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  margin-top: auto;
  gap: 4px;
`;

const ControlButton = styled(IconButton)<{ muted?: boolean }>`
  opacity: ${props => (props.muted ? 0.8 : 1)}; // reduce opacity if muted
`;

export const VolumeSlider = () => {
  const player = usePlayer();
  const entity_id = player.entity_id;
  const volume = player.attributes?.volume_level ?? 0;
  const volumeMuted = player.attributes?.is_volume_muted ?? false;

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    // Set the volume level
    getHass().callService("media_player", "volume_set", {
      entity_id,
      volume_level: newVolume,
    });
  }, []);

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
    <VolumeContainer>
      <ControlButton
        size="x-small"
        onClick={handleToggleMute}
        icon={VolumeIcon}
      />
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={volume}
        sliderSize={"small"}
        onChange={handleVolumeChange}
      />
    </VolumeContainer>
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
        <ControlButton
          size="x-small"
          onClick={() => setSliderVisible(true)}
          icon={volumeIcon}
        />
      ) : (
        <ControlButton
          size="x-small"
          onClick={() => setSliderVisible(false)}
          icon={"mdi:chevron-left"}
        />
      )}
    </Fragment>
  );
};
