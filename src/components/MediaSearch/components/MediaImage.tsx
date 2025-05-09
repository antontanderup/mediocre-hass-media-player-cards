import { Icon } from "@components/Icon";
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
  }),
};

export type MediaImageProps = {
  imageUrl?: string | null;
  className?: string;
};

export const MediaImage = ({ imageUrl, className }: MediaImageProps) => {
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
    </div>
  );
};
