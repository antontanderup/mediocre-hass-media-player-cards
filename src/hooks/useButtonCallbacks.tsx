import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import styled from "@emotion/styled";

const supportsTouchEvents = "ontouchstart" in window;

const LongPressIndicator = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-color, rgba(7, 114, 244));
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  animation: pulse 1s infinite;

  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.6; }
    50% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(0.95); opacity: 0.6; }
  }
`;

export function useButtonCallbacks({
  onTap,
  onLongPress,
  onDoubleTap,
}: {
  onTap?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
}) {
  const mouseDownTimestamp = useRef<number | null>(null);
  const numClicks = useRef(0);
  const mouseUpTimeout = useRef<NodeJS.Timeout | null>(null);
  const longPressIndicatorTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const reset = useCallback(() => {
    if (mouseUpTimeout.current) {
      clearTimeout(mouseUpTimeout.current);
    }
    if (longPressIndicatorTimeout.current) {
      clearTimeout(longPressIndicatorTimeout.current);
    }
    setIsLongPressing(false);
    mouseDownTimestamp.current = null;
    numClicks.current = 0;
  }
  , []);

  const renderLongPressIndicator = () => {
    if (!isLongPressing) return null;
    return <LongPressIndicator />;
  };

  const isLongPress = useCallback(() => {
    const now = Date.now();
    if (mouseDownTimestamp.current) {
      const duration = now - mouseDownTimestamp.current;
      if (duration >= 500) {
        return true; // Long press detected
      }
    }
    return false; // No long press detected
  }, []);

  const handleStart = useCallback(() => {
    mouseDownTimestamp.current = Date.now();
    longPressIndicatorTimeout.current = setTimeout(() => {
      setIsLongPressing(true);
    }, 500); // Long press threshold
  }, []);

  const handleEnd = useCallback(() => {
    if (mouseUpTimeout.current) {
      clearTimeout(mouseUpTimeout.current);
    }
    if (longPressIndicatorTimeout.current) {
      clearTimeout(longPressIndicatorTimeout.current);
      setIsLongPressing(false);
    }
    numClicks.current += 1;
    mouseUpTimeout.current = setTimeout(() => {
      if (numClicks.current > 1) {
        onDoubleTap?.();
      } else {
        if (isLongPress()) {
          onLongPress?.();
        } else {
          onTap?.();
        }
      }
      mouseDownTimestamp.current = null;
      numClicks.current = 0;
    }, 250); // Delay to distinguish between single and double tap
  }, [isLongPress, onDoubleTap, onLongPress, onTap]);

  const onMouseDown = useCallback(() => {
    if (!supportsTouchEvents) {
      handleStart();
    }
  }, [handleStart]);

  const onMouseUp = useCallback(() => {
    if (!supportsTouchEvents) {
      handleEnd();
    }
  }, [handleEnd]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    handleStart();
  }, [handleStart]);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    handleEnd();
  }, [handleEnd]);

  const onOut = useCallback(() => {
    reset();
  }, [reset]);

  return useMemo(
    () => ({
      onMouseDown,
      onMouseUp,
      onMouseOut: onOut,
      onTouchStart,
      onTouchEnd,
      onTouchCancel: onOut,
      renderLongPressIndicator
    }),
    [onMouseDown, onMouseUp, onTouchStart, onTouchEnd, isLongPressing, renderLongPressIndicator]
  );
}
