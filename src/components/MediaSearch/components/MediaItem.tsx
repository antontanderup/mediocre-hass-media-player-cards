import { useCallback, useState } from "preact/hooks";
import { MediaImage } from "./MediaImage";
import { css } from "@emotion/react";
import {
  ButtonHTMLAttributes,
  DOMAttributes,
  TargetedMouseEvent,
} from "preact";
import { forwardRef } from "preact/compat";

const styles = {
  root: css({
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s",
    borderRadius: "8px",
    padding: "8px",
    background: "rgba(255, 255, 255, 0.05)",
    "@media (prefers-color-scheme: light)": {
      background: "rgba(0, 0, 0, 0.05)",
    },
    "&:hover": {
      transform: "translateY(-4px)",
    },
  }),
  name: css({
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    width: "100%",
    color: "var(--primary-text-color)",
  }),
  artist: css({
    fontSize: "12px",
    color: "var(--secondary-text-color)",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    width: "100%",
  }),
  mediaImage: css({
    marginBottom: 8,
  }),
};

export type MediaItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "ref"
> & {
  imageUrl?: string | null;
  mdiIcon?: string | null;
  name: string;
  artist?: string;
};

export const MediaItem = forwardRef<HTMLButtonElement, MediaItemProps>(
  ({ imageUrl, mdiIcon, name, artist, onClick, ...buttonProps }, ref) => {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const handleOnClick: DOMAttributes<HTMLButtonElement>["onClick"] =
      useCallback(
        async (e: TargetedMouseEvent<HTMLButtonElement>) => {
          if (!onClick) return;
          if (
            typeof onClick === "function" &&
            onClick.constructor.name === "AsyncFunction"
          ) {
            setDone(false);
            setLoading(true);
            try {
              await onClick(e);
              setDone(true);
            } catch (error) {
              console.error("Error in MediaItem onClick:", error);
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
        css={styles.root}
        onClick={handleOnClick}
        {...buttonProps}
        ref={ref}
      >
        <MediaImage
          css={styles.mediaImage}
          imageUrl={imageUrl}
          mdiIcon={mdiIcon}
          loading={loading}
          done={done}
        />
        <div css={styles.name}>{name}</div>
        <div css={styles.artist}>{artist}</div>
      </button>
    );
  }
);
