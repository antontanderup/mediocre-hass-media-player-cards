import styled from "@emotion/styled";
import { ChangeEvent } from "preact/compat";

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
      color: var(--primary-color);
      margin-top: -1px;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 1px;
      height: ${props => getSliderSize(props.sliderSize || "medium")};
      background: var(--primary-color);
      box-shadow: -100vw 0 0 100vw var(--primary-color);
      border: 0;
      margin: 0;
    }

    &::-moz-range-thumb {
      width: 0;
      height: 0;
      opacity: 0;
      border: none;
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
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat((e.target as HTMLInputElement).value));
  };

  return (
    <SliderWrap sliderSize={sliderSize}>
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
