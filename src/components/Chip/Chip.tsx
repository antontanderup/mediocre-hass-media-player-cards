import { ButtonHTMLAttributes } from "preact/compat";
import { Icon, Spinner } from "@components";
import { css } from "@emotion/react";

const styles = {
  root: css({
    position: "relative",
    background: "none",
    border: "none",
    display: "flex",
    flex: 0,
    flexDirection: "row",
    height: "32px",
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: "32px",
    padding: "0 12px",
    borderRadius: "16px",
    color: "var(--mmpc-chip-foreground, var(--card-background-color))",
    backgroundColor: "var(--mmpc-chip-background, var(--primary-text-color))",
    "--icon-primary-color":
      "var(--mmpc-chip-foreground, var(--card-background-color))",
    marginRight: "5px",
    alignItems: "center",
    gap: "4px",
    textWrap: "nowrap",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
    opacity: 1,
    "& ha-icon": {
      pointerEvents: "none",
    },
  }),
  rootLoading: css({
    opacity: 0.8,
  }),
};

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
};

export const Chip = ({
  loading,
  icon,
  iconPosition = "left",
  children,
  ...buttonProps
}: ChipProps) => {
  const renderIcon = () => {
    if (loading) {
      return <Spinner size="x-small" />;
    }
    if (icon) {
      return <Icon size="x-small" icon={icon} />;
    }
  };

  return (
    <button css={[styles.root, loading && styles.rootLoading]} {...buttonProps}>
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};
