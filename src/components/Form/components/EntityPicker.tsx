import { FormGroup } from "@components/FormElements";
import { useFieldContext } from "../hooks/useAppForm";
import { EntityPicker as EntityPickerComponent } from "@components/FormElements/EntityPicker";
import { useHass } from "@components/HassContext";

export function EntityPicker({
  label,
  domains,
  required,
}: {
  label: string;
  domains?: string[];
  required?: boolean;
}) {
  // The `Field` infers that it should have a `value` type of `string`
  const hass = useHass();
  const field = useFieldContext<string | undefined>();
  return (
    <FormGroup>
      <EntityPickerComponent
        hass={hass}
        label={label}
        domains={domains}
        value={field.state.value || ""}
        required={required}
        error={field.state.meta.errors.join(", ")}
        onChange={newValue => field.handleChange(newValue)}
      />
    </FormGroup>
  );
}
