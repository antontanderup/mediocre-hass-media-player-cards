import styled from "@emotion/styled";
import { ChangeEvent, useRef } from "preact/compat";

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
      background: var(--primary-color);
      height: ${props => getSliderSize(props.sliderSize || "medium")};
    }

    /* Chrome and other browsers */
    &::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      height: ${props => getSliderSize(props.sliderSize || "medium")};
      background: var(--unselected-color);
      margin-top: -1px;
      border-radius: 6px;
      position: relative;
      z-index: 1;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 8px;
      height: ${props => getSliderSize(props.sliderSize || "medium")};
      background: var(--primary-text-color);
      border: 0;
      margin: 0;
      cursor: pointer;
      box-shadow: -2000px 0 0 2000px var(--primary-color); /* Creates the colored track before the thumb */
      position: relative;
      z-index: 2;
    }

    &::-moz-range-thumb {
      width: 8px;
      height: 100%;
      border-radius: 0;
      border: none;
      background: var(--primary-text-color);
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
