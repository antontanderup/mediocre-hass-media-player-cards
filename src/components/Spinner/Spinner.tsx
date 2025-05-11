import { Icon, IconProps } from "@components";
import { css, keyframes } from "@emotion/react";

export type SpinnerSize =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large";

export type SpinnerProps = Omit<IconProps, "icon">;

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

export const Spinner = (props: SpinnerProps) => {
  return <Icon icon="mdi:loading" css={styles.spinner} {...props} />;
};
