import { css } from "@emotion/react";

export type IconSize =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large";

export type IconProps = {
  icon: string;
  size?: IconSize;
  disabled?: boolean;
  className?: string;
};

const styles = {
  root: css({
    background: "none",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "var(--mmpc-icon-size)",
    aspectRatio: "1",
    "& > ha-icon": {
      "--mdc-icon-size": "var(--mmpc-icon-size)",
      width: "var(--mmpc-icon-size)",
      display: "flex",
    },
  }),
};

export const Icon = ({ icon, size = "medium", className }: IconProps) => {
  return (
    <div
      css={styles.root}
      style={{
        "--mmpc-icon-size": `${getIconSize(size)}px`,
      }}
      className={className}
    >
      <ha-icon icon={icon} />
    </div>
  );
};

const getIconSize = (size: IconSize) => {
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
  }
};
