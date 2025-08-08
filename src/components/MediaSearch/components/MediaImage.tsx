import { getIconSize, Icon } from "@components/Icon";
import { Spinner } from "@components/Spinner";
import { css, keyframes } from "@emotion/react";
import { getHass } from "@utils";
import { useEffect, useState } from "preact/hooks";

const fadeInOut = keyframes({
  "0%": { opacity: 1, transform: "translateY(0px)" },
  "85%": { opacity: 1, transform: "translateY(0px)" },
  "100%": { opacity: 0, transform: "translateY(-20px)" },
});

const styles = {
  root: css({
    width: "100%",
    // Creates 1:1 aspect ratio
    "&::before": {
      content: '""',
      display: "block",
      paddingTop: "100%",
    },
    borderRadius: "4px",
    "--icon-primary-color": "var(--card-background-color)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }),
  image: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "4px",
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
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [imageUrl]);

  return (
    <div css={styles.root} className={className}>
      {imageUrl && !error && (
        <img
          src={getHass().hassUrl(imageUrl)}
          css={styles.image}
          alt=""
          onError={() => setError(true)}
        />
      )}
      {(!!error || !imageUrl) && (
        <Icon icon="mdi:image-broken-variant" size="small" />
      )}
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
