import { useCallback, useMemo } from "preact/hooks";
import styled from "@emotion/styled";
import { IconButton, Slider, usePlayer } from "@components";
import { getHass } from "@utils";

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-height: 36px;
  margin-top: auto;
`;

const ControlButton = styled(IconButton)<{ muted?: boolean }>`
  opacity: ${props => (props.muted ? 0.8 : 1)}; // reduce opacity if muted
`;

export const VolumeController = () => {
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
        size="small"
        onClick={handleToggleMute}
        icon={VolumeIcon}
      />
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={volume}
        thumbSize={"large"}
        onChange={handleVolumeChange}
      />
    </VolumeContainer>
  );
};

export const getVolumeIcon = (volume, volumeMuted) => {
  if (volume === 0 || volumeMuted) return "mdi:volume-off";
  if (volume < 0.5) return "mdi:volume-medium";
  return "mdi:volume-high";
};

export const VolumeTrigger = ({ onClick }: { onClick: () => void }) => {
  const player = usePlayer();

  const volume = player.attributes?.volume_level ?? 0;
  const volumeMuted = player.attributes?.is_volume_muted ?? false;
  const volumeIcon = getVolumeIcon(volume, volumeMuted);

  return <ControlButton size="small" onClick={onClick} icon={volumeIcon} />;
};
