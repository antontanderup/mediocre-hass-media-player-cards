import { CardContext, CardContextType } from "@components/CardContext";
import { Icon, IconSize, MaFavoriteButton, usePlayer } from "@components";
import { fadeIn, theme } from "@constants";
import { css } from "@emotion/react";
import { getDeviceIcon, getHass, getSourceIcon } from "@utils";
import { ButtonHTMLAttributes, JSX } from "preact/compat";
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "preact/hooks";

export type AlbumArtProps = {
  size?: number | string;
  borderRadius?: number;
  iconSize: IconSize;
  renderLongPressIndicator?: () => JSX.Element | null;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type FavoriteAwareCardConfig = {
  ma_favorite_control?: {
    show_on_artwork?: boolean | null;
    artwork_button_size?:
      | "xx-small"
      | "x-small"
      | "small"
      | "medium"
      | "large";
  };
};

const styles = {
  root: css({
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0px",
    margin: "0px",
    position: "relative",
    overflow: "hidden",
    width: "var(--mmpc-art-width)",
    height: "var(--mmpc-art-height)",
    "&::after": {
      content: '""',
      display: "block",
      paddingBottom: "100%" /* Creates 1:1 aspect ratio */,
    },
  }),
  contentContainer: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  }),
  image: css({
    height: "100%",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    borderRadius: "var(--mmpc-art-border-radius, 4px)",
    opacity: 0,
  }),
  imageLoaded: css({
    animation: `${fadeIn} 0.3s ease forwards`,
  }),
  iconContainer: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "--icon-primary-color": theme.colors.card,
    backgroundColor: theme.colors.onCard,
    opacity: 0.5,
    borderRadius: "var(--mmpc-art-border-radius, 4px)",
    height: "100%",
    aspectRatio: "1 / 1",
  }),
  favoriteLayer: css({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  }),
};

export const AlbumArt = ({
  size,
  borderRadius = 4,
  iconSize,
  renderLongPressIndicator,
  ...buttonProps
}: AlbumArtProps) => {
  const { config } = useContext<CardContextType<FavoriteAwareCardConfig>>(
    CardContext
  );
  const player = usePlayer();
  const {
    media_title: title,
    media_artist: artist,
    entity_picture,
    entity_picture_local,
    icon,
    device_class: deviceClass,
    source,
  } = player.attributes;
  const albumArt = entity_picture_local || entity_picture;
  const state = player.state;

  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const latestImageUrl = useRef<string | null | undefined>(null);
  const showMaFavoriteOnArtwork = config.ma_favorite_control?.show_on_artwork;
  const artworkFavoriteButtonSize =
    config.ma_favorite_control?.artwork_button_size ?? "small";

  const getImage = useCallback((url?: string | null, retries = 0) => {
    if (!url) {
      setLoaded(false);
      setError(false);
      setImage(null);
      return null;
    }
    setImage(null);
    setError(false);
    const img = new Image();
    img.onerror = () => {
      if (latestImageUrl.current !== url) {
        return;
      }
      if (retries < 2) {
        setTimeout(() => {
          if (latestImageUrl.current === url) {
            getImage(url, retries + 1);
          }
        }, 500);
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

    if (img.complete) {
      // Image was cached and loaded immediately
      setError(false);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (latestImageUrl.current === albumArt) {
      return;
    }
    latestImageUrl.current = albumArt;
    getImage(albumArt);
  }, [albumArt, getImage]);

  return (
    <button
      css={styles.root}
      style={{
        "--mmpc-art-border-radius": `${borderRadius}px`,
        "--mmpc-art-width": size
          ? typeof size === "string"
            ? size
            : `${size}px`
          : "100%",
        "--mmpc-art-height": size
          ? typeof size === "string"
            ? size
            : `${size}px`
          : "unset",
        ...(typeof size === "number"
          ? {
              flexShrink: 0,
            }
          : {}),
      }}
      {...buttonProps}
    >
      <div css={styles.contentContainer}>
        {image?.src && state !== "off" && !error ? (
          <img
            css={[styles.image, loaded && styles.imageLoaded]}
            src={image.src}
            alt={
              !!title && !!artist
                ? `${title} by ${artist}`
                : `Source: ${source}`
            }
          />
        ) : (
          <div css={styles.iconContainer}>
            <Icon
              icon={
                state === "off" || !source
                  ? getDeviceIcon({ icon, deviceClass })
                  : getSourceIcon({ source })
              }
              size={iconSize}
            />
          </div>
        )}
      </div>
      {showMaFavoriteOnArtwork && (
        <div css={styles.favoriteLayer}>
          <MaFavoriteButton
            placement="artwork"
            size={artworkFavoriteButtonSize}
          />
        </div>
      )}
      {renderLongPressIndicator && renderLongPressIndicator()}
    </button>
  );
};
