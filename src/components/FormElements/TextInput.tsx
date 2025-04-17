import { HomeAssistant } from "@types";
import { useCallback } from "preact/hooks";

export type TextInputProps = {
  hass: HomeAssistant;
  value: string; // entity_id
  onChange: (value?: string) => void; // returns new entity id or undefined
  label?: string;
  required?: boolean;
  disabled?: boolean;
  isIconInput?: boolean;
};

export const TextInput = ({
  hass,
  value,
  onChange,
  label,
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
