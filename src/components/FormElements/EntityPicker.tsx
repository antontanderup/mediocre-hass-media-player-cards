import { HomeAssistant } from "@types";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { ErrorMessage } from "./StyledFormElements";

export type EntityPickerProps = {
  hass: HomeAssistant;
  value: string; // entity_id
  onChange: (value?: string) => void; // returns new entity id or undefined
  label?: string;
  domains?: string[]; // Optional domain to filter Entity
  required?: boolean;
  disabled?: boolean;
  allowCustomEntity?: boolean;
  error?: string;
};

export const EntityPicker = (props: EntityPickerProps) => {
  const {
    hass,
    value,
    onChange,
    label,
    domains,
    required = false,
    disabled = false,
    allowCustomEntity = false,
    error,
  } = props;

  const formRef = useRef<HTMLElement | null>(null);

  // Handle form changes
  const handleValueChanged = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent;
      const newValue = customEvent.detail.value;
      onChange(newValue);
    },
    [onChange]
  );

  // Attach and cleanup event listener
  useEffect(() => {
    const formElement = formRef.current;

    if (formElement) {
      formElement.addEventListener("value-changed", handleValueChanged);
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener("value-changed", handleValueChanged);
      }
    };
  }, [formRef.current, handleValueChanged]);

  return (
    <div>
      <ha-entity-picker
        ref={formRef}
        hass={hass}
        value={value}
        label={label}
        includeDomains={domains}
        disabled={disabled}
        required={required}
        allow-custom-entity={allowCustomEntity}
      />
      {!!error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};
