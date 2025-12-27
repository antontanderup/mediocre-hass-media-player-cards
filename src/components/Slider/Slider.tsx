import { IconButton } from "@components/IconButton";
import { css } from "@emotion/react";
import { isDarkMode } from "@utils";
import { useEffect, useRef, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  sliderSize?: SliderSize;
  showStepButtons?: boolean;
  className?: string;
  onStepButtonClick?: (stepDirection: "increment" | "decrement") => void;
  unit?: string;
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
    default:
      return 32;
  }
};

const styles = {
  root: css({
    width: "100%",
    position: "relative",
  }),
  slider: css({
    "--control-slider-border-radius": "6px",
  }),
  stepButton: css({
    opacity: 0.8,
    "@media (hover: hover)": {
      "&:hover": {
        backgroundColor: "unset",
      },
      "&:active": {
        backgroundColor: "unset",
      },
    },
    borderRadius: 0,
    height: "100%",
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
    "--icon-primary-color": "var(--text-primary-color)",
  }),
  decrementButtonLight: css({
    "--icon-primary-color":
      "var(--art-surface-color, rgba(255, 255, 255, 0.8))",
  }),
};

export const Slider = ({
  min,
  max,
  step,
  value,
  unit,
  sliderSize = "medium",
  showStepButtons = false,
  className,
  onStepButtonClick,
  onChange,
}: SliderProps) => {
  const [internalValue, setInternalValue] = useState<number>(value);
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  // Handle value change from ha-control-slider (value-changed event)
  const sliderRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const handler = (e: CustomEvent) => {
      const newValue = Number(e.detail.value);
      setInternalValue(newValue);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        onChange(newValue);
      }, 250);
    };
    slider.addEventListener("value-changed", handler as EventListener);
    return () => {
      slider.removeEventListener("value-changed", handler as EventListener);
    };
  }, [onChange]);

  const thickness = getSliderSize(sliderSize);

  return (
    <div css={styles.root}>
      {/* @ts-expect-error --- web component from home assistant --- */}
      <ha-control-slider
        ref={sliderRef}
        min={min}
        max={max}
        step={step}
        unit={unit}
        value={internalValue}
        aria-valuenow={internalValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-orientation="horizontal"
        css={styles.slider}
        class={className}
        style={{ "--control-slider-thickness": `${thickness}px` }}
      />
      {showStepButtons && (
        <Fragment>
          {(internalValue * 100) / max < 10 ? null : (
            <IconButton
              size="x-small"
              onClick={() => {
                if (onStepButtonClick) {
                  onStepButtonClick("decrement");
                } else {
                  onChange(Math.max(min, internalValue - step));
                }
              }}
              icon={"mdi:minus"}
              css={[
                styles.decrementButton,
                styles.stepButton,
                !isDarkMode() && styles.decrementButtonLight,
              ]}
            />
          )}
          {(internalValue * 100) / max > 90 ? null : (
            <IconButton
              size="x-small"
              onClick={() => {
                if (onStepButtonClick) {
                  onStepButtonClick("increment");
                } else {
                  onChange(Math.min(max, internalValue + step));
                }
              }}
              icon={"mdi:plus"}
              css={[styles.incrementButton, styles.stepButton]}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};
