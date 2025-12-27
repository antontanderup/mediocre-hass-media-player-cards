import { useEffect, useRef, useState } from "preact/hooks";

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

export const Slider = ({
  min,
  max,
  step,
  value,
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
  const sliderRef = useRef<any>(null);
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
    // @ts-expect-error --- web component from home assistant ---
    <ha-control-slider
      ref={sliderRef}
      min={min}
      max={max}
      step={step}
      value={internalValue}
      aria-valuenow={internalValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-orientation="horizontal"
      class={className}
      style={{ "--control-slider-thickness": `${thickness}px` }}
    />
  );
};
