import { getIconSize, Icon } from "@components/Icon";
import { Spinner } from "@components/Spinner";
import { fadeIn } from "@constants";
import { css, keyframes } from "@emotion/react";
import { getHass } from "@utils";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

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
    opacity: 0,
  }),
  imageLoaded: css({
    animation: `${fadeIn} 0.3s ease forwards`,
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
  iconNoBackground: css({
    backgroundColor: "transparent",
  }),
  done: css({
    animation: `${fadeInOut} 3s forwards`,
  }),
};

export type MediaImageProps = {
  imageUrl?: string | null;
  mdiIcon?: string | null;
  loading?: boolean;
  done?: boolean;
  className?: string;
};

export const MediaImage = ({
  imageUrl,
  mdiIcon,
  loading,
  done,
  className,
}: MediaImageProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const latestImageUrl = useRef<string | null | undefined>(null);

  useEffect(() => {
    if (latestImageUrl.current === imageUrl) {
      return;
    }
    latestImageUrl.current = imageUrl;
    getImage(imageUrl);
  }, [imageUrl]);

  const getImage = useCallback((url?: string | null, retries = 0) => {
    if (!url) {
      setLoaded(false);
      setError(false);
      setImage(null);
      return null;
    }
    setImage(null);
    const img = new Image();
    img.onerror = () => {
      if (latestImageUrl.current !== url) {
        return;
      }
      if (retries === 0) {
        // Retry once
        getImage(url, 1);
        return;
      }
      setError(true);
    };
    img.onloadstart = () => {
      if (latestImageUrl.current !== url) {
        return;
      }

      setLoaded(false);
      setError(false);
    };
    img.onload = () => {
      if (latestImageUrl.current !== url) {
        return;
      }

      setLoaded(true);
    };

    img.src = getHass().hassUrl(url);
    setImage(img);
  }, []);

  return (
    <div css={styles.root} className={className}>
      {image?.src && !error && (
        <img
          src={image?.src}
          css={[styles.image, loaded && styles.imageLoaded]}
          alt=""
        />
      )}
      {!imageUrl && mdiIcon && !error && (
        <Icon
          icon={mdiIcon}
          size="medium"
          css={[styles.icon, styles.iconNoBackground]}
        />
      )}
      {!!error && !imageUrl && !mdiIcon && (
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
