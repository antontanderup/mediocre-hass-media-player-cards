import { InteractionConfig } from "@types";
import { useMemo } from "preact/hooks";
import { useButtonCallbacks } from ".";
import { getHass, handleAction } from "@utils";

export function useActionProps({
  actionConfig,
  rootElement,
  overrideCallback,
}: {
  actionConfig: InteractionConfig;
  rootElement: HTMLElement;
  overrideCallback?: {
    onTap?: () => void;
    onLongPress?: () => void;
    onDoubleTap?: () => void;
  };
}) {
  const callbacks = useMemo(
    () => ({
      onTap: actionConfig?.tap_action
        ? () => handleAction(rootElement, actionConfig, "tap", getHass())
        : undefined,
      onLongPress: actionConfig?.hold_action
        ? () => handleAction(rootElement, actionConfig, "hold", getHass())
        : undefined,
      onDoubleTap: actionConfig?.double_tap_action
        ? () => handleAction(rootElement, actionConfig, "double_tap", getHass())
        : undefined,
      ...(overrideCallback ?? {}),
    }),
    [actionConfig, overrideCallback]
  );

  const buttonProps = useButtonCallbacks(callbacks);

  return useMemo(() => buttonProps, [buttonProps]);
}
