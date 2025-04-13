import styled from "@emotion/styled";

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  thumbSize?: HandleSize;
  onChange: (value: number) => void;
};

export type HandleSize = "xsmall" | "small" | "medium" | "large";

const SliderWrap = styled.div<{ thumbSize?: HandleSize }>`
  display: contents;

  > ha-control-slider {
    width: 100%;
    --control-slider-thickness: ${props => getHandleSize(props.thumbSize)};
    --control-slider-border-radius: 0px;
    --handle-size: 0px; // show-handle="false" is not working
  }
`;

export const Slider = ({
  min,
  max,
  step,
  value,
  thumbSize,
  onChange,
}: SliderProps) => {
  return (
    <SliderWrap thumbSize={thumbSize}>
      <ha-control-slider
        min={min}
        max={max}
        step={step}
        value={value}
        show-handle="false"
        onvalue-changed={e => {
          console.log(typeof e.detail.value);
          onChange(parseFloat(e.detail.value));
        }}
      />
    </SliderWrap>
  );
};

const getHandleSize = (thumbSize: HandleSize) => {
  switch (thumbSize) {
    case "xsmall":
      return "16px";
    case "small":
      return "24px";
    case "medium":
      return "28px";
    case "large":
      return "32px";
  }
};
