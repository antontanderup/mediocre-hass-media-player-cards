import { css, keyframes } from "@emotion/react";

export type SpinnerSize =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large";

export type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
};

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const styles = {
  spinner: css({
    animation: `${spinAnimation} 1s linear infinite`,
    "--mdc-icon-size": "var(--mmpc-spinner-size)",
    width: "var(--mmpc-spinner-size)",
    display: "flex",
    pointerEvents: "none",
  }),
};

export const Spinner = ({ size = "medium", className }: SpinnerProps) => {
  return (
    <ha-icon
      icon="mdi:loading"
      css={styles.spinner}
      style={{
        "--mmpc-spinner-size": `${getSpinnerSize(size)}px`,
      }}
      className={className}
    />
  );
};

const getSpinnerSize = (size: SpinnerSize) => {
  switch (size) {
    case "xx-small":
      return 12;
    case "x-small":
      return 18;
    case "small":
      return 24;
    case "medium":
      return 32;
    case "large":
      return 48;
    case "x-large":
      return 80;
    case "xx-large":
      return 120;
  }
};
