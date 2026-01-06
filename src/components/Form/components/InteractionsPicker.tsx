import { InteractionsPicker as InteractionsPickerComponent } from "@components/FormElements";
import { useFieldContext } from "../hooks/useAppForm";
import { useHass } from "@components";
import { InteractionConfig } from "@types";

export function InteractionsPicker() {
  const field = useFieldContext<InteractionConfig | undefined>();
  const hass = useHass();
  return (
    <InteractionsPickerComponent
      hass={hass}
      value={field.state.value}
      onChange={value => field.handleChange(value ?? {})}
    />
  );
}
