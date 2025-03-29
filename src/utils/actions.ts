import { HomeAssistant } from "custom-card-helpers";

export const performAction = ({
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
