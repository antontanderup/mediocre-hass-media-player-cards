import { Slider as BaseSlider } from "@base-ui-components/react/slider";
import { IconButton } from "@components/IconButton";
import { theme } from "@constants";
import { css } from "@emotion/react";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  sliderSize?: SliderSize;
  showStepButtons?: boolean;
  onStepButtonClick?: (stepDirection: "increment" | "decrement") => void;
  getThumbLabel?: (value: number) => string;
  onChange: (value: number) => void;
};

export type SliderSize =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large";

const styles = {
  root: css({
    width: "100%",
    "--unselected-color": "var(--divider-color)",
    margin: "0",
    position: "relative",
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
      boxShadow: "0px 0px 20px 0px var(--divider-color)",
      "@media (prefers-color-scheme: light)": {
        backgroundColor: "var(--art-surface-color, rgba(255, 255, 255, 0.8))",
        boxShadow: "0px 0px 20px 0px var(--art-on-surface-color, rgba(0, 0, 0, 0.2))",
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
    color: theme.colors.card,
    bottom: "calc(100% + 6px)",
    right: "-50%",
    backgroundColor: theme.colors.onCard,
    padding: "0px 6px",
    borderRadius: "4px",
    fontSize: 12,
    display: "none",
    "[data-dragging] &": {
      display: "block",
    },
  }),
  stepButton: css({
    opacity: 0.8,
    "@media (hover: hover)": {
      "&:hover": {
        backgroundColor: 'unset'
      },
      "&:active": {
        backgroundColor: 'unset',
      },
    },
  }),
  incrementButton: css({
    position: "absolute",
    top: "50%",
    right: "0px",
    transform: "translateY(-50%)",
  }),
  decrementButton: css({
    position: "absolute",
    top: "50%",
    left: "0px",
    transform: "translateY(-50%)",
    '--icon-primary-color': "var(--text-primary-color)",
    "@media (prefers-color-scheme: light)": {
      '--icon-primary-color': "var(--art-surface-color, rgba(255, 255, 255, 0.8))",
    },
  }),
};

export const Slider = ({
  min,
  max,
  step,
  value,
  sliderSize = "medium",
  showStepButtons = false,
  onStepButtonClick,
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
      }, 250);
    },
    [onChange]
  );

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const sliderSizeValue = getSliderSize(sliderSize);

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
            "--mmpc-slider-height": sliderSizeValue + "px",
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
      {showStepButtons && (
        <Fragment>
          {(internalValue * 100) / max < 10 ? null : (
            <IconButton
              size="x-small"
              onClick={() => {
                if (onStepButtonClick) {
                  onStepButtonClick("decrement");
                } else {
                  handleValueChange(Math.max(min, internalValue - step))
                }
              }}
              icon={"mdi:minus"}
              css={[styles.decrementButton, styles.stepButton]}
              style={{ left: sliderSizeValue / 10 + "px" }}
            />
          )}
          {(internalValue * 100) / max > 90 ? null : (
            <IconButton
              size="x-small"
              onClick={() => {
                if (onStepButtonClick) {
                  onStepButtonClick("increment");
                } else {
                  handleValueChange(Math.min(max, internalValue + step))
                }
              }}
              icon={"mdi:plus"}
              css={[styles.incrementButton, styles.stepButton]}
              style={{ right: sliderSizeValue / 10 + "px" }}
            />
          )}
        </Fragment>
      )}
    </BaseSlider.Root>
  );
};

const getSliderSize = (sliderSize: SliderSize) => {
  switch (sliderSize) {
    case "xx-small":
      return 12;
    case "x-small":
      return 18;
    case "small":
      return 24;
    case "medium":
      return 32;
    case "large":
      return 48;
    case "x-large":
      return 80;
    case "xx-large":
      return 120;
  }
};
