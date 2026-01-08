import {
  InputGroup,
  TextInput,
  TextInputProps,
} from "@components/FormElements";
import { useFieldContext } from "../hooks/useAppForm";
import { useHass } from "@components/HassContext";

export function Text({
  label,
  required,
  isIconInput,
}: { label: string } & Pick<TextInputProps, "required" | "isIconInput">) {
  const field = useFieldContext<string | undefined>();
  const hass = useHass();

  return (
    <InputGroup>
      <TextInput
        value={field.state.value ?? ""}
        onChange={value => field.handleChange(value ?? "")}
        hass={hass}
        required={required}
        isIconInput={isIconInput}
        label={label}
        error={field.state.meta.errors.join(", ")}
      />
    </InputGroup>
  );
}
