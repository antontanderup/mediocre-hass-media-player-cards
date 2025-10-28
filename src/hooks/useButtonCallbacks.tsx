import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { css } from "@emotion/react";

const supportsTouchEvents = "ontouchstart" in window;

const styles = {
  longPressIndicator: css({
    position: "fixed",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "var(--primary-color, rgba(7, 114, 244))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 9,
    animation: "pulse 1s infinite",
    transform: "translate(-50%, -50%)",
    "@keyframes pulse": {
      "0%": {
        transform: "translate(-50%, -50%) scale(0.95)",
        opacity: 0.6,
      },
      "50%": {
        transform: "translate(-50%, -50%) scale(1)",
        opacity: 0.8,
      },
      "100%": {
        transform: "translate(-50%, -50%) scale(0.95)",
        opacity: 0.6,
      },
    },
  }),
};

export function useButtonCallbacks({
  onTap,
  onLongPress,
  onDoubleTap,
}: {
  onTap?: () => Promise<void> | void;
  onLongPress?: () => Promise<void> | void;
  onDoubleTap?: () => Promise<void> | void;
}) {
  const mouseDownTimestamp = useRef<number | null>(null);
  const numClicks = useRef(0);

  const mouseUpTimeout = useRef<NodeJS.Timeout | null>(null);
  const longPressIndicatorTimeout = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(false);

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
      <div
        css={styles.longPressIndicator}
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
    mouseUpTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        if (numClicks.current > 1) {
          await onDoubleTap?.();
        } else {
          if (isLongPress()) {
            await onLongPress?.();
          } else {
            await onTap?.();
          }
        }
      } catch (error) {
        console.error("Error in button callback:", error);
      }
      setLoading(false);
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
            loading,
          }
        : {
            onMouseDown,
            onMouseMove,
            onMouseUp: handleEnd,
            onMouseOut: reset,
            loading,
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
