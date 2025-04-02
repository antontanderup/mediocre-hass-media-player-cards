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
  const callbacks = useMemo(
    () => ({
      onTap: !!actionConfig?.tap_action
        ? () => {
            const action = actionConfig.tap_action;
            if (action.action === "perform-action") {
              return performAction({
                hass,
                action: action.perform_action,
                target: action.target,
                data: action.data,
              });
            }
            return handleAction(
              rootElement,
              hass,
              patchAction(
                "tap_action",
                actionConfig as InteractionConfigLegacy
              ),
              "tap"
            );
          }
        : undefined,
      onLongPress: !!actionConfig?.hold_action
        ? async () => {
            const action = actionConfig.hold_action;
            if (action.action === "perform-action") {
              return performAction({
                hass,
                action: action.perform_action,
                target: action.target,
                data: action.data,
              });
            }
            return handleAction(
              rootElement,
              hass,
              patchAction(
                "hold_action",
                actionConfig as InteractionConfigLegacy
              ),
              "hold"
            );
          }
        : undefined,
      onDoubleTap: !!actionConfig?.double_tap_action
        ? () => {
            const action = actionConfig.double_tap_action;
            if (action.action === "perform-action") {
              return performAction({
                hass,
                action: action.perform_action,
                target: action.target,
                data: action.data,
              });
            }
            return handleAction(
              rootElement,
              hass,
              patchAction(
                "double_tap_action",
                actionConfig as InteractionConfigLegacy
              ),
              "double_tap"
            );
          }
        : undefined,
      ...(overrideCallback ?? {}),
    }),
    [actionConfig, overrideCallback]
  );

  const buttonProps = useButtonCallbacks(callbacks);

  return useMemo(() => buttonProps, [buttonProps]);
}
