import { css } from "@emotion/react";
import { HTMLAttributes, InputHTMLAttributes } from "preact/compat";

const styles = {
  formGroup: css({
    marginBottom: "16px",
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
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "var(--primary-color, #03a9f4)",
    color: "white",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "var(--primary-color-dark, #007ac1)",
    },
    alignSelf: "flex-start",
  }),
  deleteButton: css({
    backgroundColor: "var(--error-color, #ff5252)",
    "&:hover": {
      backgroundColor: "var(--error-color-dark, #c50b0b)",
    },
  }),
  inputGroup: css({
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  }),
  toggleContainer: css({
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
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

export const Button = (
  props: HTMLAttributes<HTMLButtonElement> & {
    type: "button" | "reset" | "submit" | undefined;
  }
) => {
  return <button css={styles.button} {...props} />;
};

export const DeleteButton = (
  props: HTMLAttributes<HTMLButtonElement> & {
    type: "button" | "reset" | "submit" | undefined;
  }
) => {
  return <button css={[styles.button, styles.deleteButton]} {...props} />;
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
