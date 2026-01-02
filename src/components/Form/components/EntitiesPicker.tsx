import { FormGroup } from "@components/FormElements";
import { useFieldContext } from "../hooks/useAppForm";
import { EntitiesPicker as EntitiesPickerComponent } from "@components/FormElements/EntitiesPicker";
import { useHass } from "@components/HassContext";
import { MediaPlayerConfigEntity } from "@types";

export function EntitiesPicker({
  label,
  domains,
}: {
  label: string;
  domains?: string[];
}) {
  // The `Field` infers that it should have a `value` type of `string`
  const hass = useHass();
  const field = useFieldContext<MediaPlayerConfigEntity[] | undefined>();

  return (
    <FormGroup>
      <EntitiesPickerComponent
        hass={hass}
        value={field.state.value ?? []}
        onChange={value => {
          field.handleChange(value);
        }}
        label={label}
        domains={domains}
      />
    </FormGroup>
  );
}
