import {
  Toggle as ToggleComponent,
  ToggleContainer,
  ToggleLabel,
} from "@components/FormElements";
import { useFieldContext } from "../hooks/useAppForm";

export function Toggle({ label }: { label: string }) {
  const field = useFieldContext<boolean | undefined>();
  return (
    <ToggleContainer>
      <ToggleComponent
        id={field.name}
        checked={field.state.value}
        onChange={e =>
          field.handleChange((e.target as HTMLInputElement)?.checked ?? false)
        }
      />
      <ToggleLabel htmlFor={field.name}>{label}</ToggleLabel>
    </ToggleContainer>
  );
}
