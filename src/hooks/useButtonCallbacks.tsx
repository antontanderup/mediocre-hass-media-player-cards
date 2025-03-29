import { useCallback, useMemo, useRef } from "preact/hooks";

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
      if (duration >= 300) {
        return true; // Long press detected
      }
    }
    return false; // No long press detected
  }, []);

  const onMouseDown = useCallback(() => {
    mouseDownTimestamp.current = Date.now();
    numClicks.current += 1;
  }, []);

  const onMouseUp = useCallback(() => {
    if (mouseUpTimeout.current) {
      clearTimeout(mouseUpTimeout.current);
    }

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
    }, 100);
  }, []);

  return useMemo(
    () => ({
      onMouseDown,
      onMouseUp,
    }),
    [onMouseDown, onMouseUp]
  );
}
