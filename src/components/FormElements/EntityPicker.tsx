import { HomeAssistant } from "@types";
import { useCallback, useEffect, useRef } from "preact/hooks";

export type EntityPickerProps = {
  hass: HomeAssistant;
  value: string; // entity_id
  onChange: (value?: string) => void; // returns new entity id or undefined
  label?: string;
  domains?: string[]; // Optional domain to filter Entity
  required?: boolean;
  disabled?: boolean;
  allowCustomEntity?: boolean;
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
    <ha-entity-picker
      ref={formRef}
      hass={hass}
      value={value}
      label={label || "Entity"}
      includeDomains={domains}
      disabled={disabled}
      required={required}
      allow-custom-entity={allowCustomEntity}
    />
  );
};
