import { HomeAssistant } from "@types";
import { useCallback } from "preact/hooks";
import { ErrorMessage } from "./StyledFormElements";
import { css } from "@emotion/react";

export type TextInputProps = {
  value: string; // entity_id
  onChange: (value?: string) => void; // returns new entity id or undefined
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
} & (
  | {
      hass: HomeAssistant;
      isIconInput: true;
    }
  | {
      hass?: HomeAssistant;
      isIconInput?: false;
    }
);

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
  }),
};

export const TextInput = ({
  hass,
  value,
  onChange,
  label,
  error,
  required = false,
  disabled = false,
  isIconInput = false,
}: TextInputProps) => {
  const handleValueChanged = useCallback(
    (e: CustomEvent) => {
      onChange(e.detail.value);
    },
    [onChange]
  );

  const renderField = () => {
    if (isIconInput) {
      return (
        <ha-icon-picker
          label={label || "Icon"}
          hass={hass}
          value={value}
          disabled={disabled}
          required={required}
          onvalue-changed={handleValueChanged}
        />
      );
    }

    return (
      <ha-textfield
        label={label || "Text"}
        value={value}
        disabled={disabled}
        required={required}
        onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
      />
    );
  };

  return (
    <div css={styles.root}>
      {renderField()}
      {!!error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};
