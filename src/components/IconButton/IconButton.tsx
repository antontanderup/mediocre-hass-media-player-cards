import { ButtonHTMLAttributes, JSX } from "preact/compat";
import { css, keyframes } from "@emotion/react";

export type ButtonSize =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  renderLongPressIndicator?: () => JSX.Element | null;
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
  root: css({
    position: "relative",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "background-color 0.2s",
    padding: 4,
    minWidth: "var(--mmpc-icon-button-size)",
    aspectRatio: "1",
    color: "var(--primary-text-color, #333)",
    touchAction: "manipulation", // iOS fixes for stuck hover states
    "-webkit-tap-highlight-color": "transparent",
    "&:hover": {
      backgroundColor: "var(--secondary-background-color, rgba(0, 0, 0, 0.05))",
    },
    "&:active": {
      backgroundColor: "var(--divider-color, rgba(0, 0, 0, 0.1))",
    },
    "@media (hover: none)": {
      "&:hover": {
        backgroundColor: "transparent",
      },
      "&:active": {
        backgroundColor: "var(--divider-color, rgba(0, 0, 0, 0.1))",
      },
    },
    "> ha-icon": {
      "--mdc-icon-size": "var(--mmpc-icon-button-size)",
      width: "var(--mmpc-icon-button-size)",
      display: "flex",
      pointerEvents: "none",
    },
  }),
  rootDisabled: css({
    color: "var(--disabled-text-color, #999)",
  }),
  rootXxsmall: css({
    padding: 0,
  }),
  rootLoading: css({
    "> ha-icon": {
      animation: `${spinAnimation} 1s linear infinite`,
    },
  }),
};

export const IconButton = ({
  icon,
  size = "medium",
  disabled = false,
  loading = false,
  className,
  renderLongPressIndicator,
  ...buttonProps
}: IconButtonProps) => {
  return (
    <button
      disabled={disabled}
      css={[
        styles.root,
        disabled && styles.rootDisabled,
        size === "xx-small" && styles.rootXxsmall,
        loading && styles.rootLoading,
      ]}
      style={{
        "--mmpc-icon-button-size": `${getButtonSize(size)}px`,
      }}
      className={className}
      {...buttonProps}
    >
      {loading ? <ha-icon icon="mdi:loading" /> : <ha-icon icon={icon} />}
      {renderLongPressIndicator && renderLongPressIndicator()}
    </button>
  );
};

const getButtonSize = (size: ButtonSize) => {
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
