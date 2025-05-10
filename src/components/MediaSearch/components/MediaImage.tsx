import { Icon } from "@components/Icon";
import { Spinner } from "@components/Spinner";
import { css } from "@emotion/react";

const styles = {
  root: css({
    width: "100%",
    aspectRatio: "1",
    borderRadius: "4px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "var(--mmpc-media-image-background)",
    "--icon-primary-color": "var(--card-background-color)",
    position: "relative",
  }),
  spinner: css({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }),
};

export type MediaImageProps = {
  imageUrl?: string | null;
  loading?: boolean;
  className?: string;
};

export const MediaImage = ({ imageUrl, loading, className }: MediaImageProps) => {
  return (
    <div
      css={styles.root}
      style={{
        "--mmpc-media-image-background": imageUrl
          ? `url(${imageUrl})`
          : "var(--primary-text-color)",
      }}
      className={className}
    >
      {!imageUrl && <Icon icon="mdi:image-broken-variant" size="small" />}
      {loading && <Spinner css={styles.spinner} size="medium" />}
    </div>
  );
};
