import styled from "@emotion/styled";
import { useRef, useEffect, useState, useCallback } from "preact/compat";

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  sliderSize?: SliderSize;
  onChange: (value: number) => void;
};

export type SliderSize = "xsmall" | "small" | "medium" | "large";

const SliderContainer = styled.div<{ sliderSize?: SliderSize }>`
  position: relative;
  width: 100%;
  height: ${props => getSliderSize(props.sliderSize || "medium")}px;
  border-radius: 6px;
  background-color: var(--divider-color);
  overflow: hidden;
  cursor: pointer;
`;

const SliderTrack = styled.div<{ fillPercentage: number }>`
  position: absolute;
  height: 100%;
  width: ${props => props.fillPercentage}%;
  background-color: var(--primary-color);
  border-radius: 6px 0 0 6px;
`;

const SliderThumb = styled.div<{ position: number }>`
  position: absolute;
  left: calc(${props => props.position}% - 10px);
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 4px;
  border-radius: 4px;
  background-color: var(--primary-text-color);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export const Slider = ({
  min,
  max,
  step,
  value,
  sliderSize = "medium",
  onChange,
}: SliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const [internalValue, setInternalValue] = useState(value);
  const debounceTimerRef = useRef<number | null>(null);

  // Update internal state when props change
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const calculatePercentage = (value: number): number => {
    return ((value - min) / (max - min)) * 100;
  };

  const calculateValue = (percentage: number): number => {
    // Calculate raw value
    const rawValue = min + (percentage / 100) * (max - min);

    // Apply step
    const steppedValue = Math.round(rawValue / step) * step;

    // Constrain to min/max
    return Math.max(min, Math.min(max, steppedValue));
  };

  const debounceCallback = useCallback(
    (newValue: number) => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        onChange(newValue);
        debounceTimerRef.current = null;
      }, 50); // 50ms debounce time
    },
    [onChange]
  );

  const handlePositionChange = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    const newValue = calculateValue(percentage);

    if (newValue !== internalValue) {
      setInternalValue(newValue);
      debounceCallback(newValue);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    handlePositionChange(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current) {
      handlePositionChange(e.clientX);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: TouchEvent) => {
    isDragging.current = true;
    handlePositionChange(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging.current) {
      handlePositionChange(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleClick = (e: MouseEvent) => {
    handlePositionChange(e.clientX);
  };

  useEffect(() => {
    return () => {
      // Cleanup
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const percentage = calculatePercentage(internalValue);

  return (
    <SliderContainer
      ref={containerRef}
      sliderSize={sliderSize}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <SliderTrack fillPercentage={percentage} />
      <SliderThumb position={percentage} />
    </SliderContainer>
  );
};

const getSliderSize = (sliderSize: SliderSize): number => {
  switch (sliderSize) {
    case "xsmall":
      return 14;
    case "small":
      return 20;
    case "medium":
      return 24;
    case "large":
      return 28;
  }
};
