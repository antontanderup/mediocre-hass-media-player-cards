import { useCallback, useMemo, useRef } from "preact/hooks";
const supportsTouchEvents = "ontouchstart" in window;

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
  }, []);

  const handleEnd = useCallback(() => {
    if (mouseUpTimeout.current) {
      clearTimeout(mouseUpTimeout.current);
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

  const onTouchStart = useCallback(() => {
    handleStart();
  }, [handleStart]);

  const onTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  return useMemo(
    () => ({
      onMouseDown,
      onMouseUp,
      onTouchStart,
      onTouchEnd,
    }),
    [onMouseDown, onMouseUp, onTouchStart, onTouchEnd]
  );
}
