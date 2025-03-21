import { FC, Fragment } from "preact/compat";
import { InteractionConfig } from "../../types";
import { ActionConfigurator } from "./ActionConfigurator";
import { HomeAssistant } from "custom-card-helpers";
import styled from "@emotion/styled";

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

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
  return (
    <ActionsContainer>
      <ActionConfigurator
        hass={hass}
        label="Tap"
        value={value.tap_action}
        onChange={(newValue) => {
          onChange({ ...value, tap_action: newValue });
        }}
      />
      <ActionConfigurator
        hass={hass}
        label="Double Tap"
        value={value.double_tap_action}
        onChange={(newValue) => {
          onChange({ ...value, double_tap_action: newValue });
        }}
      />
      <ActionConfigurator
        hass={hass}
        label="Hold"
        value={value.hold_action}
        onChange={(newValue) => {
          onChange({ ...value, hold_action: newValue });
        }}
      />
    </ActionsContainer>
  );
};
