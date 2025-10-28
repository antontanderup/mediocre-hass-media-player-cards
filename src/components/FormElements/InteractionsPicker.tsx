import { InteractionConfig } from "@types";
// import { ActionConfigurator } from "./ActionConfigurator";
import { HomeAssistant } from "@types";
import { ActionsConfigurator } from "./ActionsConfigurator";

export type InteractionsPickerProps = {
  hass: HomeAssistant;
  value?: InteractionConfig;
  onChange: (value?: InteractionConfig) => void;
};

export const InteractionsPicker = ({
  hass,
  value = {},
  onChange,
}: InteractionsPickerProps) => {
  return <ActionsConfigurator hass={hass} value={value} onChange={onChange} />;
};
