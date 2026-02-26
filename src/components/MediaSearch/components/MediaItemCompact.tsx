import { useCallback, useState } from "preact/hooks";
import { Icon } from "@components/Icon";
import { css } from "@emotion/react";
import {
  ButtonHTMLAttributes,
  DOMAttributes,
  TargetedMouseEvent,
} from "preact";
import { forwardRef } from "preact/compat";
import { isDarkMode } from "@utils";

const styles = {
  root: css({
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.2s",
    borderRadius: "8px",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  }),
  rootLight: css({
    background: "rgba(0, 0, 0, 0.05)",
  }),
  backgroundIcon: css({
    position: "absolute",
    right: -10,
    bottom: -10,
    opacity: 0.12,
    pointerEvents: "none",
  }),
  name: css({
    fontSize: "13px",
    fontWeight: 500,
    textAlign: "left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    color: "var(--primary-text-color)",
    position: "relative",
  }),
};

export type MediaItemCompactProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "ref"
> & {
  mdiIcon?: string | null;
  name: string;
};

export const MediaItemCompact = forwardRef<
  HTMLButtonElement,
  MediaItemCompactProps
>(({ mdiIcon, name, onClick, ...buttonProps }, ref) => {
  const [loading, setLoading] = useState(false);

  const handleOnClick: DOMAttributes<HTMLButtonElement>["onClick"] =
    useCallback(
      async (e: TargetedMouseEvent<HTMLButtonElement>) => {
        if (!onClick) return;
        if (
          typeof onClick === "function" &&
          onClick.constructor.name === "AsyncFunction"
        ) {
          setLoading(true);
          try {
            await onClick(e);
          } catch (error) {
            console.error("Error in MediaItemCompact onClick:", error);
          }
          setLoading(false);
        } else {
          onClick(e);
        }
      },
      [onClick]
    );

  return (
    <button
      css={[styles.root, !isDarkMode() && styles.rootLight]}
      onClick={handleOnClick}
      disabled={loading}
      {...buttonProps}
      ref={ref}
    >
      {mdiIcon && (
        <Icon icon={mdiIcon} size="x-large" css={styles.backgroundIcon} />
      )}
      <div css={styles.name}>{name}</div>
    </button>
  );
});
