import { Slider as BaseSlider } from "@base-ui-components/react/slider";
import { css } from "@emotion/react";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  sliderSize?: SliderSize;
  onChange: (value: number) => void;
};

export type SliderSize = "xsmall" | "small" | "medium" | "large";

const styles = {
  root: css({
    width: "100%",
    "--unselected-color": "var(--divider-color)",
    margin: "0",
  }),
  control: css({
    position: "relative",
    cursor: "pointer",
  }),
  track: css({
    background: "var(--unselected-color)",
    height: "var(--mmpc-slider-height)",
    borderRadius: "6px",
    overflow: "hidden",
  }),
  indicator: css({
    background: "var(--primary-color)",
    height: "100%",
    borderRadius: "4px",
  }),
  thumb: css({
    width: "6px",
    height: "64%",
    backgroundColor: "var(--text-primary-color)",
    "@media (prefers-color-scheme: light)": {
      backgroundColor: "var(--art-surface-color, rgba(255, 255, 255, 0.8))",
    },
    cursor: "pointer",
    borderRadius: "2px",
    marginLeft: "-8px",
  }),
};

export const Slider = ({
  min,
  max,
  step,
  value,
  sliderSize = "medium",
  onChange,
}: SliderProps) => {
  const [internalValue, setInternalValue] = useState<number>(value);
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>();

  const handleValueChange = useCallback(
    (newVolume: number) => {
      setInternalValue(newVolume);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        onChange(newVolume);
      }, 200);
    },
    [onChange]
  );

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <BaseSlider.Root
      css={styles.root}
      value={internalValue}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      step={step}
    >
      <BaseSlider.Control css={styles.control}>
        <BaseSlider.Track
          css={styles.track}
          style={{
            "--mmpc-slider-height": getSliderSize(sliderSize),
          }}
        >
          <BaseSlider.Indicator css={styles.indicator} />
          <BaseSlider.Thumb css={styles.thumb} />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
};

const getSliderSize = (sliderSize: SliderSize) => {
  switch (sliderSize) {
    case "xsmall":
      return "16px";
    case "small":
      return "22px";
    case "medium":
      return "28px";
    case "large":
      return "32px";
  }
};
