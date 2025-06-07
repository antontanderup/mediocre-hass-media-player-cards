import { HomeAssistant } from "@types";
import { InteractionConfig, InteractionType } from "@types";

const performAction = ({
  hass,
  action,
  target,
  data,
}: {
  hass: HomeAssistant;
  action: string;
  target: object;
  data: object;
}) => {
  const domain = action.split(".")[0];
  const service = action.split(".")[1];

  // Combine target and data into a single serviceData object
  const serviceData = {
    ...data,
    ...target,
  };

  return hass.callService(domain, service, serviceData);
};

export const handleAction = async (
  element: HTMLElement,
  actionConfig: InteractionConfig,
  action: InteractionType,
  hass: HomeAssistant
) => {
  const actionObject =
    actionConfig[
      (action + "_action") as "tap_action" | "hold_action" | "double_tap_action"
    ];
  if (actionObject?.action === "perform-action") {
    // Performing it like this let's us await for the action to finish
    // which let's us display a loading spinner
    return performAction({
      hass,
      action: actionObject.perform_action,
      target: actionObject.target,
      data: actionObject.data,
    });
  }

  // Thank you to bubble card for inspiration for this
  const event = new CustomEvent("hass-action", {
    bubbles: true,
    composed: true,
    detail: {
      config: {
        ...actionConfig,
        entity_id: actionConfig?.entity,
      },
      action,
    },
  });
  element.dispatchEvent(event);
  return Promise.resolve();
};
