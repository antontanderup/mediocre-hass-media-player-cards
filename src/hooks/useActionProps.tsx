import { handleAction, HomeAssistant } from "custom-card-helpers";
import {
  InteractionConfig,
  ActionConfig,
  InteractionConfigLegacy,
} from "../types/actionTypes";
import { useMemo } from "preact/hooks";
import { useButtonCallbacks } from ".";
import { performAction } from "../utils";

const patchAction = (
  action: "tap_action" | "double_tap_action" | "hold_action",
  interactionConfig: InteractionConfigLegacy
): InteractionConfigLegacy => {
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
  const buttonProps = useButtonCallbacks({
    onTap: () => {
      if (overrideCallback?.onTap) {
        overrideCallback.onTap();
        return;
      }
      const action = actionConfig?.tap_action;
      if (!action) return;
      if (action?.action === "perform-action") {
        performAction({
          hass,
          action: action.perform_action,
          target: action.target,
          data: action.data,
        });
        return;
      }
      handleAction(
        rootElement,
        hass,
        patchAction("tap_action", actionConfig as InteractionConfigLegacy),
        "tap"
      );
    },
    onLongPress: () => {
      if (overrideCallback?.onLongPress) {
        overrideCallback.onLongPress();
        return;
      }
      const action = actionConfig?.hold_action;
      if (!action) return;
      if (action?.action === "perform-action") {
        performAction({
          hass,
          action: action.perform_action,
          target: action.target,
          data: action.data,
        });
        return;
      }
      handleAction(
        rootElement,
        hass,
        patchAction("hold_action", actionConfig as InteractionConfigLegacy),
        "hold"
      );
    },
    onDoubleTap: () => {
      if (overrideCallback?.onDoubleTap) {
        overrideCallback.onDoubleTap();
        return;
      }
      const action = actionConfig?.double_tap_action;
      if (!action) return;
      if (action?.action === "perform-action") {
        performAction({
          hass,
          action: action.perform_action,
          target: action.target,
          data: action.data,
        });
        return;
      }
      handleAction(
        rootElement,
        hass,
        patchAction(
          "double_tap_action",
          actionConfig as InteractionConfigLegacy
        ),
        "double_tap"
      );
    },
  });

  return useMemo(() => buttonProps, [buttonProps]);
}
