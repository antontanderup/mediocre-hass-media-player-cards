import styled from "@emotion/styled";
import { Slider as BaseSlider } from "@base-ui-components/react/slider";

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  sliderSize?: SliderSize;
  onChange: (value: number) => void;
};

export type SliderSize = "xsmall" | "small" | "medium" | "large";

// Styled BaseUI slider components
const StyledRoot = styled(BaseSlider.Root)`
  width: 100%;
  --unselected-color: var(--divider-color);
  margin: 0;
`;

const StyledControl = styled(BaseSlider.Control)`
  position: relative;
  cursor: pointer;
`;

const StyledTrack = styled(BaseSlider.Track)<{ sliderSize?: SliderSize }>`
  background: var(--unselected-color);
  height: ${props => getSliderSize(props.sliderSize || "medium")};
  border-radius: 6px;
  overflow: hidden;
`;

const StyledIndicator = styled(BaseSlider.Indicator)`
  background: var(--primary-color);
  height: 100%;
  border-radius: 4px;
`;

const StyledThumb = styled(BaseSlider.Thumb)<{ sliderSize?: SliderSize }>`
  width: 6px;
  height: 64%;
  background-color: var(--text-primary-color);
  @media (prefers-color-scheme: light) {
    background-color: var(--art-surface-color, rgba(255, 255, 255, 0.8));
  }
  cursor: pointer;
  border-radius: 2px;
  margin-left: -8px;
`;

export const Slider = ({
  min,
  max,
  step,
  value,
  sliderSize = "medium",
  onChange,
}: SliderProps) => {
  return (
    <StyledRoot
      value={value}
      onValueChange={value => onChange(value)}
      min={min}
      max={max}
      step={step}
    >
      <StyledControl>
        <StyledTrack sliderSize={sliderSize}>
          <StyledIndicator />
          <StyledThumb sliderSize={sliderSize} />
        </StyledTrack>
      </StyledControl>
    </StyledRoot>
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
