import { useHass } from "@components/HassContext";
import { Slider, SliderProps } from "@components/Slider";
import { css } from "@emotion/react";
import { getHass, setVolume } from "@utils";
import { useCallback } from "preact/hooks";

export type VolumeSliderProps = {
  entityId: string;
  useVolumeUpDownForSteps?: boolean;
  syncGroupChildren: boolean;
} & Omit<
  SliderProps,
  "value" | "onChange" | "min" | "max" | "step" | "getThumbLabel"
>;

const styles = {
  off: css({
    opacity: 0.25,
    overflow: "hidden",
    borderRadius: "6px",
    "--primary-color": "var(--disabled-text-color)",
    "--text-primary-color": "var(--disabled-text-color)",
    "--art-surface-color": "var(--disabled-text-color)",
  }),
};

export const VolumeSlider = ({
  entityId,
  useVolumeUpDownForSteps,
  syncGroupChildren,
  ...sliderProps
}: VolumeSliderProps) => {
  const hass = useHass();

  const player = hass.states[entityId];
  const isOff = player?.state === "off";
  const volumeLevel = player?.attributes?.volume_level ?? 0;

  const handleVolumeChange = useCallback(
    (volume: number) => {
      const newVolume = volume / 100;
      // Use setVolume utility, with sync if this is the main speaker
      setVolume(entityId, newVolume, syncGroupChildren);
    },
    [entityId, syncGroupChildren]
  );

  const handleVolumeStepChange = useCallback(
    (stepDirection: "increment" | "decrement") => {
      const serviceName =
        stepDirection === "increment" ? "volume_up" : "volume_down";
      getHass().callService("media_player", serviceName, {
        entity_id: entityId,
      });
    },
    []
  );

  return (
    <Slider
      min={0}
      max={100}
      step={1}
      value={volumeLevel * 100}
      onChange={handleVolumeChange}
      unit="%"
      onStepButtonClick={
        useVolumeUpDownForSteps ? handleVolumeStepChange : undefined
      }
      css={isOff ? styles.off : {}}
      {...sliderProps}
    />
  );
};
