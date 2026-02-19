import { IconButton } from "@components/IconButton";
import { theme } from "@constants";
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

const getSliderSize = (sliderSize: SliderSize): number => {
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

const DRAG_THRESHOLD_PX = 4;

const styles = {
  root: css({
    width: "100%",
    position: "relative",
    userSelect: "none",
    WebkitUserSelect: "none",
  }),
  track: css({
    position: "relative",
    width: "100%",
    borderRadius: "6px",
    overflow: "hidden",
    cursor: "pointer",
    touchAction: "none",
    WebkitTapHighlightColor: "transparent",
    backgroundColor: theme.colors.onCardDivider,
  }),
  fill: css({
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "var(--primary-color)",
    pointerEvents: "none",
  }),
  thumb: css({
    position: "absolute",
    top: "50%",
    height: "60%",
    width: "5px",
    transform: "translate(-10px, -50%)",
    backgroundColor: "var(--text-primary-color)",
    borderRadius: "3px",
    pointerEvents: "none",
  }),
  thumbLight: css({
    backgroundColor: "var(--art-surface-color, rgba(255, 255, 255, 0.8))",
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
  unit: _unit,
  sliderSize = "medium",
  showStepButtons = false,
  className,
  onStepButtonClick,
  onChange,
}: SliderProps) => {
  const [internalValue, setInternalValue] = useState<number>(value);
  const trackRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>();
  const dragRef = useRef<{
    startX: number;
    startValue: number;
    hasMoved: boolean;
  } | null>(null);

  useEffect(() => {
    if (!dragRef.current && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const snapToStep = (val: number): number => {
    const stepped = Math.round((val - min) / step) * step + min;
    return Math.max(min, Math.min(max, stepped));
  };

  const fillPercent = ((internalValue - min) / (max - min)) * 100;

  const handlePointerDown = (e: PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    track.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startValue: internalValue,
      hasMoved: false,
    };
  };

  const handlePointerMove = (e: PointerEvent) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track) return;

    const dx = e.clientX - drag.startX;
    if (!drag.hasMoved) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      // Threshold crossed — anchor startX here so there's no jump
      drag.hasMoved = true;
      drag.startX = e.clientX;
      drag.startValue = internalValue;
      return;
    }

    const trackWidth = track.getBoundingClientRect().width;
    const valueDelta = (dx / trackWidth) * (max - min);
    const newValue = snapToStep(drag.startValue + valueDelta);
    setInternalValue(newValue);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => onChange(newValue), 250);
  };

  const handlePointerUp = (e: PointerEvent) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track) return;

    if (!drag.hasMoved) {
      // Tap: step in the direction relative to the thumb position
      const rect = track.getBoundingClientRect();
      const thumbX = rect.left + (fillPercent / 100) * rect.width;

      if (e.clientX <= thumbX) {
        if (onStepButtonClick) {
          onStepButtonClick("decrement");
        } else {
          const newVal = snapToStep(internalValue - step);
          setInternalValue(newVal);
          onChange(newVal);
        }
      } else {
        if (onStepButtonClick) {
          onStepButtonClick("increment");
        } else {
          const newVal = snapToStep(internalValue + step);
          setInternalValue(newVal);
          onChange(newVal);
        }
      }
    } else {
      // End of drag — commit final value immediately
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      onChange(internalValue);
    }

    dragRef.current = null;
  };

  const thickness = getSliderSize(sliderSize);

  return (
    <div css={styles.root} className={className}>
      <div
        ref={trackRef}
        css={styles.track}
        style={{ height: `${thickness}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={internalValue}
        aria-orientation="horizontal"
        tabIndex={0}
      >
        <div css={styles.fill} style={{ width: `${fillPercent}%` }} />
        <div
          css={[styles.thumb, !isDarkMode() && styles.thumbLight]}
          style={{ left: `${fillPercent}%` }}
        />
      </div>
      {showStepButtons && (
        <Fragment>
          {fillPercent < 10 ? null : (
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
          {fillPercent > 90 ? null : (
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
