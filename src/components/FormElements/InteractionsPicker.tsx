import { FC, Fragment } from "preact/compat";
import { InteractionConfig } from "../../types";
// import { ActionConfigurator } from "./ActionConfigurator";
import { HomeAssistant } from "custom-card-helpers";
import styled from "@emotion/styled";
import { ActionsConfigurator } from "./ActionsConfigurator";

export type InteractionsPickerProps = {
  hass: HomeAssistant;
  value?: InteractionConfig;
  onChange: (value?: InteractionConfig) => void;
};

export const InteractionsPicker: FC<InteractionsPickerProps> = ({
  hass,
  value = {},
  onChange,
}) => {
  return <ActionsConfigurator hass={hass} value={value} onChange={onChange} />;
};
