import { useCallback, useState } from "preact/hooks";
import { JSX } from "preact/compat";
import { MediaImage } from "./MediaImage";
import { css } from "@emotion/react";

const styles = {
  root: css({
    display: "grid",
    gridTemplateColumns: "50px 1fr auto",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
    borderRadius: "8px",
    gridColumn: "1/-1",
    background: "rgba(255, 255, 255, 0.05)",
    cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
    "@media (prefers-color-scheme: light)": {
      background: "rgba(0, 0, 0, 0.05)",
      "&:hover": {
        background: "rgba(0, 0, 0, 0.01)",
      },
    },
  }),
  trackInfo: css({
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }),
  trackName: css({
    fontSize: "14px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "var(--primary-text-color)",
  }),
  trackArtist: css({
    fontSize: "12px",
    color: "var(--secondary-text-color)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  mediaImage: css({
    width: 50,
    height: 50,
  }),
  rootNotClickable: css({
    cursor: "default",
  }),
  actions: css({
    display: "flex",
    gap: 4,
    alignItems: "center",
  }),
};

export type MediaTrackProps = {
  imageUrl?: string | null;
  title: string;
  artist?: string;
  onClick?: () => Promise<void>;
  actions?: JSX.Element;
};

export const MediaTrack = ({
  imageUrl,
  title,
  artist,
  onClick,
  actions,
}: MediaTrackProps) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const handleOnClick = useCallback(async () => {
    if (!onClick) return;
    setDone(false);
    setLoading(true);
    try {
      await onClick();
      setDone(true);
    } catch (error) {
      console.error("Error in MediaItem onClick:", error);
    }
    setLoading(false);
  }, [onClick]);

  return (
    <div
      css={[styles.root, !onClick && styles.rootNotClickable]}
      onClick={onClick ? handleOnClick : undefined}
    >
      <MediaImage
        css={styles.mediaImage}
        imageUrl={imageUrl}
        loading={loading}
        done={done}
      />
      <div css={styles.trackInfo}>
        <div css={styles.trackName}>{title}</div>
        {!!artist && <div css={styles.trackArtist}>{artist}</div>}
      </div>
      {actions && <div css={styles.actions}>{actions}</div>}
    </div>
  );
};
