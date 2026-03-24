import { getIconSize, Icon } from "@components/Icon";
import { Spinner } from "@components/Spinner";
import { fadeIn } from "@constants";
import { css, keyframes } from "@emotion/react";
import { getHass } from "@utils";
import { memo } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { getMediaPlaceholderText } from "./getMediaPlaceholderText";

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
  placeholder: css({
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b3b3b3",
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: "clamp(1.3rem, 3.4vw, 3rem)",
    fontWeight: 500,
    letterSpacing: "-0.04em",
    userSelect: "none",
  }),
  done: css({
    animation: `${fadeInOut} 3s forwards`,
  }),
};

export type MediaImageProps = {
  imageUrl?: string | null;
  mdiIcon?: string | null;
  fallbackText?: string | null;
  loading?: boolean;
  done?: boolean;
  className?: string;
};

export const MediaImage = memo<MediaImageProps>(
  ({
    imageUrl,
    mdiIcon,
    fallbackText,
    loading,
    done,
    className,
  }: MediaImageProps) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const latestImageUrl = useRef<string | null | undefined>(null);

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

    useEffect(() => {
      if (latestImageUrl.current === imageUrl) {
        return;
      }
      latestImageUrl.current = imageUrl;
      getImage(imageUrl);
    }, [imageUrl, getImage]);

    const placeholderText = getMediaPlaceholderText(fallbackText);

    return (
      <div css={styles.root} className={className}>
        {image?.src && !error && (
          <img
            src={image?.src}
            css={[styles.image, loaded && styles.imageLoaded]}
            alt=""
          />
        )}
        {!image?.src && !mdiIcon && !!placeholderText && (
          <div css={styles.placeholder}>{placeholderText}</div>
        )}
        {!image?.src && mdiIcon && !error && (
          <Icon
            icon={mdiIcon}
            size="medium"
            css={[styles.icon, styles.iconNoBackground]}
          />
        )}
        {!!error && !mdiIcon && !!placeholderText && (
          <div css={styles.placeholder}>{placeholderText}</div>
        )}
        {!!error && (!placeholderText || !!mdiIcon) && (
          <Icon
            icon={mdiIcon ?? "mdi:image-broken-variant"}
            size="medium"
            css={[styles.icon, styles.iconNoBackground]}
          />
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
  }
);
