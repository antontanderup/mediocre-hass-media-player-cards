import { ActionConfig, handleAction, HomeAssistant } from "custom-card-helpers";
import { InteractionConfig } from "../types/actionTypes";
import { useMemo } from "preact/hooks";
import { useButtonCallbacks } from ".";

const patchAction = (
  action: "tap_action" | "double_tap_action" | "hold_action",
  interactionConfig: InteractionConfig
): InteractionConfig => {
  if (
    interactionConfig[action].action === "more-info" &&
    !!interactionConfig[action].entity
  ) {
    return {
      ...interactionConfig,
      entity: interactionConfig[action].entity,
    };
  }
  return interactionConfig;
};

export function useActionProps({
  actionConfig,
  rootElement,
  hass,
}: {
  actionConfig: InteractionConfig;
  rootElement: HTMLElement;
  hass: HomeAssistant;
}) {
  const buttonProps = useButtonCallbacks({
    onTap: () => {
      handleAction(
        rootElement,
        hass,
        patchAction("tap_action", actionConfig),
        "tap"
      );
    },
    onLongPress: () => {
      handleAction(
        rootElement,
        hass,
        patchAction("hold_action", actionConfig),
        "hold"
      );
    },
    onDoubleTap: () => {
      handleAction(
        rootElement,
        hass,
        patchAction("double_tap_action", actionConfig),
        "double_tap"
      );
    },
  });

  return useMemo(() => buttonProps, [buttonProps]);
}
