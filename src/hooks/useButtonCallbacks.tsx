// Ai generated crap below because i couldnt be bothered
import { useCallback, useMemo, useRef } from "preact/hooks";

export function useButtonCallbacks({
  onTap,
  onLongPress,
  onDoubleTap,
}: {
  onTap: () => void;
  onLongPress?: () => void;
  onDoubleTap: () => void;
}) {
  const longPressTimeout = useRef<number | null>(null);
  const resetTimeout = useRef<number | null>(null);
  const actionType = useRef<"tap" | "hold" | "double_tap" | null>(null);
  const isDoubleClick = useRef<boolean>(false);

  const resetAction = useCallback(() => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    actionType.current = null;
    isDoubleClick.current = false;
  }, []);

  const performAction = useCallback(() => {
    if (actionType.current === null) return;
    switch (actionType.current) {
      case "tap":
        onTap();
        break;
      case "hold":
        onLongPress?.();
        break;
      case "double_tap":
        onDoubleTap();
        break;
    }
    // Cleanup after action
    resetAction();
  }, [actionType, resetAction]);

  const onMouseDown = useCallback(() => {
    actionType.current = "tap";
    longPressTimeout.current = window.setTimeout(() => {
      actionType.current = "hold";
    }, 300); // 300ms for long press

    resetTimeout.current = window.setTimeout(resetAction, 2000); // 2000ms for reset if onMouseUp is not triggered
  }, [resetAction]);

  const onMouseUp = useCallback(() => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
      resetTimeout.current = null;
    }
    if (!isDoubleClick.current && actionType.current !== "double_tap") {
      setTimeout(() => {
        if (!isDoubleClick.current) {
          performAction();
        }
      }, 250); // Wait 250ms to check if double click occurred
    }
  }, [performAction]);

  const onDblClick = useCallback(
    e => {
      e.preventDefault();
      isDoubleClick.current = true;
      actionType.current = "double_tap";
      performAction();
    },
    [performAction]
  );

  return useMemo(
    () => ({
      onMouseDown,
      onMouseUp,
      onDblClick,
      hasLongPress: !!onLongPress,
    }),
    [onMouseDown, onMouseUp, onDblClick]
  );
}
