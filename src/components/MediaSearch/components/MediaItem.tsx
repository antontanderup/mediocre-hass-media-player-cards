import { MediaImage } from "./MediaImage";
import { css } from "@emotion/react";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
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

export type MediaItemProps = {
  imageUrl?: string | null;
  name: string;
  artist?: string;
  onClick: () => void;
};

export const MediaItem = ({
  imageUrl,
  name,
  artist,
  onClick,
}: MediaItemProps) => {
  return (
    <div css={styles.root} onClick={onClick}>
      <MediaImage css={styles.mediaImage} imageUrl={imageUrl} />
      <div css={styles.name}>{name}</div>
      <div css={styles.artist}>{artist}</div>
    </div>
  );
};
