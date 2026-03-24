import { Icon } from "@components/Icon";
import { theme } from "@constants";
import { css, keyframes } from "@emotion/react";
import { CSSProperties } from "preact";

interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  clearable?: boolean;
  disabled?: boolean;
  type?: string;
  label?: string;
  name?: string;
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
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
    color: theme.colors.onCard,
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
    padding: "8px 12px",
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
  inputWithClearButton: css({
    paddingRight: "36px",
  }),
  inputWithTrailingIcons: css({
    paddingRight: "56px",
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
  iconWithClearButton: css({
    right: "36px",
  }),
  clearButton: css({
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "var(--secondary-text-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    cursor: "pointer",
    "&:hover": {
      color: "var(--primary-text-color)",
    },
  }),
};

export const Input = ({
  value = "",
  placeholder,
  onChange,
  clearable = false,
  disabled,
  type = "text",
  label,
  name,
  loading = false,
  className,
  style,
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.((e.target as HTMLInputElement).value);
  };
  const showClearButton = clearable && !!value && !disabled;
  const showLoadingIndicator = loading && !showClearButton;

  return (
    <div css={styles.root} className={className} style={style}>
      {label && <label css={styles.label}>{label}</label>}
      <input
        css={[
          styles.input,
          showClearButton && styles.inputWithClearButton,
          showClearButton && showLoadingIndicator && styles.inputWithTrailingIcons,
        ]}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        type={type}
        name={name}
      />
      {showLoadingIndicator && (
        <Icon
          size="x-small"
          icon="mdi:loading"
          css={[styles.icon, showClearButton && styles.iconWithClearButton]}
        />
      )}
      {showClearButton && (
        <button
          type="button"
          css={styles.clearButton}
          onClick={() => onChange?.("")}
          aria-label="Clear input"
        >
          <Icon size="x-small" icon="mdi:close" />
        </button>
      )}
    </div>
  );
};
