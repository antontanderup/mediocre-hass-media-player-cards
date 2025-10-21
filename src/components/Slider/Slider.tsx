import { Slider as BaseSlider } from "@base-ui-components/react/slider";
import { css } from "@emotion/react";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  sliderSize?: SliderSize;
  getThumbLabel?: (value: number) => string;
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
  }),
  indicator: css({
    background: "var(--primary-color)",
    height: "100%",
    borderRadius: "4px",
  }),
  thumb: css({
    width: "16px",
    height: "var(--mmpc-slider-height)",
    cursor: "pointer",
    background: "var(--primary-color)",
    position: "relative",
    borderRadius: "6px",
    top: "0px !important",
    translate: "-50% 0% !important",
    ["&:after"]: {
      content: '""',
      position: "absolute",
      transform: "translate(-50%, -50%)",
      backgroundColor: "var(--text-primary-color)",
      "@media (prefers-color-scheme: light)": {
        backgroundColor: "var(--art-surface-color, rgba(255, 255, 255, 0.8))",
      },
      width: "6px",
      borderRadius: "2px",
      top: "50%",
      left: "50%",
      height: "68%",
    },
  }),
  value: css({
    position: "absolute",
    color: "var(--text-primary-color)",
    "@media (prefers-color-scheme: light)": {
      color: "var(--art-surface-color, rgba(255, 255, 255, 0.8))",
    },
    bottom: "calc(100% + 6px)",
    right: "-50%",
    backgroundColor: "var(--primary-color)",
    padding: "0px 6px",
    borderRadius: "4px",
    fontSize: 12,
    display: "none",
    "[data-dragging] &": {
      display: "block",
    },
  }),
};

export const Slider = ({
  min,
  max,
  step,
  value,
  sliderSize = "medium",
  getThumbLabel,
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
      thumbAlignment="edge"
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
          <BaseSlider.Thumb css={styles.thumb}>
            {getThumbLabel ? (
              <div css={styles.value}>{getThumbLabel(internalValue)}</div>
            ) : null}
          </BaseSlider.Thumb>
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
