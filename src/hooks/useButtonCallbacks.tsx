import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import styled from "@emotion/styled";

const supportsTouchEvents = "ontouchstart" in window;

const LongPressIndicator = styled.div`
  position: fixed;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-color, rgba(7, 114, 244));
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 9;
  animation: pulse 1s infinite;
  transform: translate(-50%, -50%);

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.6;
    }
    50% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.6;
    }
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
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
  }, []);

  const renderLongPressIndicator = () => {
    if (!isLongPressing) return null;
    return (
      <LongPressIndicator
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    );
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

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    setPosition({ x: clientX, y: clientY });
  }, []);

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      mouseDownTimestamp.current = Date.now();
      updatePosition(clientX, clientY);
      longPressIndicatorTimeout.current = setTimeout(() => {
        setIsLongPressing(true);
      }, 500); // Long press threshold
    },
    [updatePosition]
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (isLongPressing) {
        updatePosition(clientX, clientY);
      }
    },
    [isLongPressing, updatePosition]
  );

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

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY);
    },
    [handleStart]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove]
  );

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
      }
    },
    [handleStart]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    },
    [handleMove]
  );

  return useMemo(
    () => ({
      ...(supportsTouchEvents
        ? {
            onTouchStart,
            onTouchMove,
            onTouchEnd: handleEnd,
            onTouchCancel: reset,
          }
        : {
            onMouseDown,
            onMouseMove,
            onMouseUp: handleEnd,
            onMouseOut: reset,
          }),
      renderLongPressIndicator,
    }),
    [
      onMouseDown,
      onMouseMove,
      handleEnd,
      reset,
      onTouchStart,
      onTouchMove,
      renderLongPressIndicator,
    ]
  );
}
