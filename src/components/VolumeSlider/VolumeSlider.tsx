import { useHass } from "@components/HassContext";
import { Slider, SliderProps } from "@components/Slider";
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

export const VolumeSlider = ({
  entityId,
  useVolumeUpDownForSteps,
  syncGroupChildren,
  ...sliderProps
}: VolumeSliderProps) => {
  const hass = useHass();

  const volumeLevel = hass.states[entityId]?.attributes?.volume_level ?? 0;

  const handleVolumeChange = useCallback(
    (volume: number) => {
      // Use setVolume utility, with sync if this is the main speaker
      setVolume(entityId, volume, syncGroupChildren);
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
      max={1}
      step={0.01}
      value={volumeLevel}
      onChange={handleVolumeChange}
      onStepButtonClick={
        useVolumeUpDownForSteps ? handleVolumeStepChange : undefined
      }
      getThumbLabel={value => `${Math.round(value * 100)}%`}
      {...sliderProps}
    />
  );
};
