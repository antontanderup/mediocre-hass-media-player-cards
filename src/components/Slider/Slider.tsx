import { IconButton } from "@components/IconButton";
import { theme } from "@constants";
import { css } from "@emotion/react";
import { isDarkMode } from "@utils";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
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
    display: "flex",
    alignItems: "center",
  }),
  slider: css({
    width: "100%",
    appearance: "none",
    background: "var(--unselected-color)",
    height: "var(--mmpc-slider-height)",
    borderRadius: "6px",
    outline: "none",
    position: "relative",
    transition: "background 0.2s",
    padding: 0,
    margin: 0,
    zIndex: 1,
    // Track fill
    "&::-webkit-slider-runnable-track": {
      height: "var(--mmpc-slider-height)",
      background: "var(--unselected-color)",
      borderRadius: "6px",
    },
    "&::-moz-range-track": {
      height: "var(--mmpc-slider-height)",
      background: "var(--unselected-color)",
      borderRadius: "6px",
    },
    // Thumb
    "&::-webkit-slider-thumb": {
      appearance: "none",
      width: "16px",
      height: "var(--mmpc-slider-height)",
      background: "var(--primary-color)",
      borderRadius: "6px",
      position: "relative",
      cursor: "pointer",
      boxShadow: "0px 0px 20px 0px var(--divider-color)",
      border: "none",
      zIndex: 2,
    },
    "&::-moz-range-thumb": {
      width: "16px",
      height: "var(--mmpc-slider-height)",
      background: "var(--primary-color)",
      borderRadius: "6px",
      cursor: "pointer",
      boxShadow: "0px 0px 20px 0px var(--divider-color)",
      border: "none",
    },
    "&::-ms-thumb": {
      width: "16px",
      height: "var(--mmpc-slider-height)",
      background: "var(--primary-color)",
      borderRadius: "6px",
      cursor: "pointer",
      boxShadow: "0px 0px 20px 0px var(--divider-color)",
      border: "none",
    },
    // Remove outline on focus
    ":focus": {
      outline: "none",
    },
    // Progress fill (for Chrome)
    "&::-webkit-slider-thumb:after": {
      content: '""',
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "var(--text-primary-color)",
      width: "6px",
      height: "68%",
      borderRadius: "6px",
      boxShadow: "0px 0px 20px 0px var(--divider-color)",
    },
  }),
  sliderLight: css({
    "&::-webkit-slider-thumb:after": {
      backgroundColor: "var(--art-surface-color, rgba(255, 255, 255, 0.8))",
      boxShadow:
        "0px 0px 20px 0px var(--art-on-surface-color, rgba(0, 0, 0, 0.2))",
    },
  }),
  value: css({
    position: "absolute",
    color: theme.colors.card,
    width: "fit-content",
    bottom: "calc(100% + 6px)",
    right: "-50%",
    backgroundColor: theme.colors.onCard,
    padding: "0px 6px",
    borderRadius: "4px",
    fontSize: 12,
    display: "none",
    zIndex: 99,
    // Show when dragging
    "&.show": {
      display: "block",
    },
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
  sliderSize = "medium",
  showStepButtons = false,
  className,
  onStepButtonClick,
  getThumbLabel,
  onChange,
}: SliderProps) => {
  const [internalValue, setInternalValue] = useState<number>(value);
  const [dragging, setDragging] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>();

  const handleValueChange = useCallback(
    (e: Event) => {
      const target = e.target as HTMLInputElement;
      const newValue = Number(target.value);
      setInternalValue(newValue);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        onChange(newValue);
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

  // Calculate percent for track fill
  const percent = ((internalValue - min) / (max - min)) * 100;

  return (
    <div
      css={styles.root}
      className={className}
      style={{ position: "relative", minWidth: 0 }}
    >
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
        </Fragment>
      )}
      <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onInput={handleValueChange}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          onTouchStart={() => setDragging(true)}
          onTouchEnd={() => setDragging(false)}
          css={[
            styles.slider,
            !isDarkMode() && styles.sliderLight,
          ]}
          style={{
            "--mmpc-slider-height": sliderSizeValue + "px",
            background: `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percent}%, var(--unselected-color) ${percent}%, var(--unselected-color) 100%)`,
          } as any}
        />
        {getThumbLabel ? (
          <div
            css={styles.value}
            className={dragging ? "show" : undefined}
            style={{ left: `calc(${percent}% - 16px)` }}
          >
            {getThumbLabel(internalValue)}
          </div>
        ) : null}
      </div>
      {showStepButtons && (
        <Fragment>
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
