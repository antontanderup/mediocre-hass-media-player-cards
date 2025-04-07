import { HomeAssistant } from "custom-card-helpers";
import { InteractionConfig } from "../types/actionTypes";
import { useMemo } from "preact/hooks";
import { useButtonCallbacks } from ".";
import { handleAction } from "../utils";

export function useActionProps({
  actionConfig,
  rootElement,
  hass,
  overrideCallback,
}: {
  actionConfig: InteractionConfig;
  rootElement: HTMLElement;
  hass: HomeAssistant;
  overrideCallback?: {
    onTap?: () => void;
    onLongPress?: () => void;
    onDoubleTap?: () => void;
  };
}) {
  const callbacks = useMemo(
    () => ({
      onTap: !!actionConfig?.tap_action
        ? () => handleAction(rootElement, actionConfig, "tap", hass)
        : undefined,
      onLongPress: !!actionConfig?.hold_action
        ? async () => handleAction(rootElement, actionConfig, "hold", hass)
        : undefined,
      onDoubleTap: !!actionConfig?.double_tap_action
        ? () => handleAction(rootElement, actionConfig, "double_tap", hass)
        : undefined,
      ...(overrideCallback ?? {}),
    }),
    [actionConfig, overrideCallback]
  );

  const buttonProps = useButtonCallbacks(callbacks);

  return useMemo(() => buttonProps, [buttonProps]);
}
