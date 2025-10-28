import { useCallback, useContext, useMemo } from "preact/hooks";
import {
  CardContext,
  CardContextType,
  IconButton,
  usePlayer,
  VolumeSlider,
} from "@components";
import { getHass, getVolumeIcon } from "@utils";
import { css } from "@emotion/react";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";

const styles = {
  root: css({
    display: "flex",
    alignItems: "center",
    flex: 1,
    maxHeight: "36px",
    marginTop: "auto",
    gap: "8px",
  }),
  buttonMuted: css({
    opacity: 0.8,
  }),
};

export const VolumeController = () => {
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const { speaker_group } = config;

  const player = usePlayer();

  const entity_id = player.entity_id;
  const volume = player.attributes?.volume_level ?? 0;
  const volumeMuted = player.attributes?.is_volume_muted ?? false;

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
      <IconButton
        css={volumeMuted ? styles.buttonMuted : {}}
        size="small"
        onClick={handleToggleMute}
        icon={VolumeIcon}
      />
      <VolumeSlider
        entityId={speaker_group?.entity_id ?? entity_id}
        syncGroupChildren={true}
        sliderSize={"medium"}
        showStepButtons={config.options?.show_volume_step_buttons ?? false}
        useVolumeUpDownForSteps={
          config.options?.use_volume_up_down_for_step_buttons ?? false
        }
      />
    </div>
  );
};

export const VolumeTrigger = ({ onClick }: { onClick: () => void }) => {
  const player = usePlayer();

  const volume = player.attributes?.volume_level ?? 0;
  const volumeMuted = player.attributes?.is_volume_muted ?? false;
  const volumeIcon = getVolumeIcon(volume, volumeMuted);

  return <IconButton size="small" onClick={onClick} icon={volumeIcon} />;
};
