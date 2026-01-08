import { css } from "@emotion/react";
import { HTMLAttributes, InputHTMLAttributes } from "preact/compat";

const styles = {
  formGroup: css({
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  }),
  label: css({
    display: "block",
    marginBottom: "16px",
    fontWeight: 500,
  }),
  buttonsContainer: css({
    display: "flex",
    flexDirection: "column",
  }),
  button: css({
    alignSelf: "flex-start",
  }),
  inputGroup: css({
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  }),
  toggleContainer: css({
    display: "flex",
    alignItems: "center",
  }),
  toggleLabel: css({
    marginLeft: "8px",
    fontWeight: "normal",
  }),
  toggle: css({
    cursor: "pointer",
  }),
  errorMessage: css({
    color: "var(--error-color, #ff5252)",
    marginTop: "8px",
    fontSize: "14px",
  }),
};

export const FormGroup = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div css={styles.formGroup} {...props} />;
};

export const Label = (props: HTMLAttributes<HTMLLabelElement>) => {
  return <label css={styles.label} {...props} />;
};

export const ButtonsContainer = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div css={styles.buttonsContainer} {...props} />;
};

export const Button = ({
  children,
  size = "small",
  variant = "brand",
  appearance = "accent",
  onClick,
}: {
  children: string;
  size?: "small" | "medium";
  variant?: "brand" | "neutral" | "danger" | "warning" | "success";
  appearance?: "accent" | "filled" | "plain";
  onClick?: () => void;
}) => {
  return (
    <ha-button
      variant={variant}
      appearance={appearance}
      size={size}
      css={styles.button}
      onClick={onClick}
    >
      {children}
    </ha-button>
  );
};

export const InputGroup = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div css={styles.inputGroup} {...props} />;
};

export const ToggleContainer = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div css={styles.toggleContainer} {...props} />;
};

export const ToggleLabel = (
  props: HTMLAttributes<HTMLLabelElement> & { htmlFor?: string }
) => {
  return <label css={styles.toggleLabel} {...props} />;
};

export const Toggle = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return <input type="checkbox" css={styles.toggle} {...props} />;
};

export const ErrorMessage = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div css={styles.errorMessage} {...props} />;
};
