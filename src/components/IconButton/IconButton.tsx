import { ButtonHTMLAttributes, JSX, forwardRef } from "preact/compat";
import { css } from "@emotion/react";
import { Spinner } from "@components";
import { theme } from "@constants";

export type ButtonSize =
  | "xxx-small"
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "ref"
> & {
  icon: string;
  size?: ButtonSize;
  disabled?: boolean;
  selected?: boolean;
  loading?: boolean;
  renderLongPressIndicator?: () => JSX.Element | null;
};

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
    color: theme.colors.onCard,
    touchAction: "manipulation", // iOS fixes for stuck hover states
    "-webkit-tap-highlight-color": "transparent",
    "@media (hover: hover)": {
      "&:hover": {
        backgroundColor: "var(--divider-color, rgba(0, 0, 0, 0.2))",
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
  rootSelected: css({
    backgroundColor: "var(--divider-color, rgba(0, 0, 0, 0.1))",
    margin: -4,
    padding: 8,
  }),
  rootDisabled: css({
    cursor: "not-allowed",
    color: "var(--disabled-text-color, #999)",
    opacity: 0.5,
  }),
  rootXxsmall: css({
    padding: 0,
  }),
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = "medium",
      disabled = false,
      loading = false,
      selected = false,
      style = {},
      className,
      renderLongPressIndicator,
      ...buttonProps
    },
    ref
  ) => {
    return (
      <button
        disabled={disabled}
        css={[
          styles.root,
          disabled && styles.rootDisabled,
          size === "xx-small" && styles.rootXxsmall,
          selected && styles.rootSelected,
        ]}
        style={{
          "--mmpc-icon-button-size": `${getButtonSize(size)}px`,
          ...(typeof style === "object" ? style : {}),
        }}
        className={className}
        {...buttonProps}
        ref={ref}
      >
        {loading ? <Spinner size={size} /> : <ha-icon icon={icon} />}
        {renderLongPressIndicator && renderLongPressIndicator()}
      </button>
    );
  }
);

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case "xxx-small":
      return 8;
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
