import styled from "@emotion/styled";
import { ChangeEvent, useEffect, useRef } from "preact/compat";

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  sliderSize?: SliderSize;
  onChange: (value: number) => void;
};

export type SliderSize = "xsmall" | "small" | "medium" | "large";

const SliderWrap = styled.div<{ sliderSize?: SliderSize }>`
  display: contents;
  --unselected-color: var(--divider-color);
  --slider-progress: 0%;

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: ${props => getSliderSize(props.sliderSize || "medium")};
    background: var(--unselected-color);
    outline: none;
    border-radius: 6px;
    overflow: hidden;
    margin: 0px;

    /* Firefox specific styles */
    &::-moz-range-track {
      background: var(--unselected-color);
      height: ${props => getSliderSize(props.sliderSize || "medium")};
    }

    &::-moz-range-progress {
      background: var(--primary-color); /* Revert to primary color */
      height: ${props => getSliderSize(props.sliderSize || "medium")};
    }

    /* Chrome and other browsers */
    &::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      height: ${props => getSliderSize(props.sliderSize || "medium")};
      background: linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) var(--slider-progress), var(--unselected-color) var(--slider-progress));
      margin-top: -1px;
      border-radius: 6px;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 8px;
      height: ${props => getSliderSize(props.sliderSize || "medium")};
      background: var(--primary-text-color); /* Keep default text color */
      border: 0;
      margin: 0;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 8px;
      height: 100%;
      border-radius: 0;
      border: none;
      background: var(--primary-text-color); /* Keep default text color */
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }
  }
`;

export const Slider = ({
  min,
  max,
  step,
  value,
  sliderSize,
  onChange,
}: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateSliderProgress = () => {
    if (sliderRef.current) {
      const percentage = ((value - min) / (max - min)) * 100;
      sliderRef.current.style.setProperty('--slider-progress', `${percentage}%`);
    }
  };

  useEffect(() => {
    updateSliderProgress();
  }, [value, min, max]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat((e.target as HTMLInputElement).value));
  };

  return (
    <SliderWrap sliderSize={sliderSize} ref={sliderRef}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
    </SliderWrap>
  );
};

const getSliderSize = (sliderSize: SliderSize) => {
  switch (sliderSize) {
    case "xsmall":
      return "14px";
    case "small":
      return "20px";
    case "medium":
      return "24px";
    case "large":
      return "28px";
  }
};
