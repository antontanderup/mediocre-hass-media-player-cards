import { getIconSize, Icon } from "@components/Icon";
import { Spinner } from "@components/Spinner";
import { css, keyframes } from "@emotion/react";

const fadeInOut = keyframes({
  "0%": { opacity: 1, transform: "translateY(0px)" },
  "85%": { opacity: 1, transform: "translateY(0px)" },
  "100%": { opacity: 0, transform: "translateY(-20px)" },
});

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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  icon: css({
    position: "absolute",
    "--icon-primary-color": "var(--primary-text-color, #333)",
    backgroundColor: "var(--card-background-color)",
    borderRadius: "50%",
    padding: "2px",
    // below needed for iOS quirk
    width: getIconSize("x-small") + 4,
    height: getIconSize("x-small") + 4,
  }),
  done: css({
    animation: `${fadeInOut} 3s forwards`,
  }),
};

export type MediaImageProps = {
  imageUrl?: string | null;
  loading?: boolean;
  done?: boolean;
  className?: string;
};

export const MediaImage = ({
  imageUrl,
  loading,
  done,
  className,
}: MediaImageProps) => {
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
      {loading && <Spinner css={styles.icon} size="x-small" />}
      {!loading && done && (
        <Icon
          icon="mdi:check"
          size="x-small"
          css={[styles.icon, styles.done]}
        />
      )}
    </div>
  );
};
