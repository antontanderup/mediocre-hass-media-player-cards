import { HomeAssistant } from "@types";
import { useCallback, useEffect, useMemo, useRef } from "preact/hooks";
import { InteractionConfig } from "@types";
import { getActionsFormSchema } from "./actionsSchema";

export type ActionsConfiguratorProps = {
  hass: HomeAssistant;
  value: InteractionConfig | undefined;
  onChange: (value?: InteractionConfig) => void;
  disabled?: boolean;
};

export const ActionsConfigurator = ({
  hass,
  value,
  onChange,
  disabled = false,
}: ActionsConfiguratorProps) => {
  const formRef = useRef<HTMLElement | null>(null);

  // Transform ActionConfig to data format for ha-form
  const data = useMemo(() => {
    if (!value) {
      return { action: "none" };
    }
    const result: Record<string, unknown> = { ...value };

    return result;
  }, [value]);

  // Handle form changes
  const handleValueChanged = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent;
      const newData = customEvent.detail.value;

      onChange(newData);
    },
    [onChange]
  );

  // Set up event listeners
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
    <ha-form
      ref={formRef}
      hass={hass}
      data={data}
      schema={getActionsFormSchema()}
      computeLabel={item => item.label || item.name}
      disabled={disabled}
    />
  );
};
