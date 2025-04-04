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

  > ha-slider {
    width: 100%;
    --_handle-height: ${props => getHandleSize(props.thumbSize)} !important;
    --_handle-width: ${props => getHandleSize(props.thumbSize)} !important;
    --_inactive-track-color: var(--divider-color, rgba(0, 0, 0, 0.1));
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
      <ha-slider
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={e =>
          onChange(parseFloat((e.target as HTMLInputElement).value))
        }
      />
    </SliderWrap>
  );
};

const getHandleSize = (thumbSize: HandleSize) => {
  switch (thumbSize) {
    case "xsmall":
      return "8px";
    case "small":
      return "12px";
    case "medium":
      return "14px";
    case "large":
      return "16px";
  }
};
