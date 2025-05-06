import { Input as BaseInput } from "@base-ui-components/react/input";
import { Icon } from "@components/Icon";
import { css, keyframes } from "@emotion/react";

interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  type?: string;
  label?: string;
  name?: string;
  loading?: boolean;
  className?: string;
}

const spinAnimation = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

const styles = {
  root: css({
    display: "flex",
    position: "relative",
  }),
  label: css({
    display: "block",
    marginBottom: "8px",
    color: "var(--primary-text-color)",
    fontSize: "14px",
    fontWeight: 500,
  }),
  input: css({
    "--input-text-color": "var(--primary-text-color)",
    "--input-bg-color": "var(--secondary-background-color)",
    "--input-border-color": "var(--divider-color)",
    "--input-focus-border-color": "var(--secondary-text-color)",
    "--input-disabled-bg-color": "var(--disabled-color)",
    "--input-disabled-text-color": "var(--disabled-text-color)",
    width: "100%",
    padding: "8px",
    color: "var(--input-text-color)",
    backgroundColor: "var(--input-bg-color)",
    border: "none",
    boxShadow: "0 0 1px 1px var(--input-border-color)",
    borderRadius: "6px",
    fontSize: "14px",
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 1px 1px var(--input-focus-border-color)",
    },
    "&:disabled": {
      backgroundColor: "var(--input-disabled-bg-color)",
      color: "var(--input-disabled-text-color)",
      cursor: "not-allowed",
    },
  }),
  icon: css({
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    "& ha-icon": {
      pointerEvents: "none",
      animation: `${spinAnimation} 1s linear infinite`,
    },
  }),
};

export const Input = ({
  value = "",
  placeholder,
  onChange,
  disabled,
  type = "text",
  label,
  name,
  loading = false,
  className,
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.((e.target as HTMLInputElement).value);
  };

  return (
    <div css={styles.root} className={className}>
      {label && <label css={styles.label}>{label}</label>}
      <BaseInput
        css={styles.input}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        type={type}
        name={name}
      />
      {loading && <Icon size="x-small" icon="mdi:loading" css={styles.icon} />}
    </div>
  );
};
