import styled from "@emotion/styled";
import { Input as BaseInput } from "@base-ui-components/react/input";

interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  type?: string;
  label?: string;
  name?: string;
}

const StyledInput = styled(BaseInput)`
  --input-text-color: var(--primary-text-color);
  --input-bg-color: var(--secondary-background-color);
  --input-border-color: var(--divider-color);
  --input-focus-border-color: var(--secondary-text-color);
  --input-disabled-bg-color: var(--disabled-color);
  --input-disabled-text-color: var(--disabled-text-color);

  width: 100%;
  padding: 8px;
  color: var(--input-text-color);
  background-color: var(--input-bg-color);
  border: none;
  box-shadow: 0 0 1px 1px var(--input-border-color);
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    box-shadow: 0 0 1px 1px var(--input-focus-border-color);
  }

  &:disabled {
    background-color: var(--input-disabled-bg-color);
    color: var(--input-disabled-text-color);
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div`
  display: flex;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: var(--primary-text-color);
  font-size: 14px;
  font-weight: 500;
`;

export const Input = ({
  value = "",
  placeholder,
  onChange,
  disabled,
  type = "text",
  label,
  name,
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.((e.target as HTMLInputElement).value);
  };

  return (
    <InputContainer>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInput
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        type={type}
        name={name}
      />
    </InputContainer>
  );
};
