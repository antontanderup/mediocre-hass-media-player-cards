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
};

export type MediaTrackProps = {
  imageUrl?: string | null;
  title: string;
  artist: string;
  onClick: () => void;
};

export const MediaTrack = ({
  imageUrl,
  title,
  artist,
  onClick,
}: MediaTrackProps) => {
  return (
    <div css={styles.root} onClick={onClick}>
      <MediaImage css={styles.mediaImage} imageUrl={imageUrl} />
      <div css={styles.trackInfo}>
        <div css={styles.trackName}>{title}</div>
        <div css={styles.trackArtist}>{artist}</div>
      </div>
    </div>
  );
};
