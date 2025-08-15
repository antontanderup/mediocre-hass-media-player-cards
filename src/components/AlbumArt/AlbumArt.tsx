import { Icon, IconSize, usePlayer } from "@components";
import { theme } from "@constants";
import { css } from "@emotion/react";
import { getDeviceIcon } from "@utils";
import { ButtonHTMLAttributes, JSX, useEffect, useState } from "preact/compat";
import { getHass } from "@utils";

export type AlbumArtProps = {
  size?: number | string;
  borderRadius?: number;
  iconSize: IconSize;
  renderLongPressIndicator?: () => JSX.Element | null;
} & ButtonHTMLAttributes<HTMLButtonElement>;

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
};

export const AlbumArt = ({
  size,
  borderRadius = 4,
  iconSize,
  renderLongPressIndicator,
  ...buttonProps
}: AlbumArtProps) => {
  const player = usePlayer();
  const {
    media_title: title,
    media_artist: artist,
    entity_picture: albumArt,
    icon,
    device_class: deviceClass,
    source,
  } = player.attributes;
  const state = player.state;

  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [albumArt]);

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
        {albumArt && state !== "off" && !error ? (
          <img
            css={styles.image}
            src={getHass().hassUrl(albumArt)}
            alt={
              !!title && !!artist
                ? `${title} by ${artist}`
                : `Source: ${source}`
            }
            onError={() => setError(true)}
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
      {renderLongPressIndicator && renderLongPressIndicator()}
    </button>
  );
};

const getSourceIcon = ({ source }: { source: string }) => {
  switch (source?.toLowerCase()) {
    case "spotify":
      return "mdi:spotify";
    case "airplay":
      return "mdi:cast-audio-variant";
    case "bluetooth":
      return "mdi:bluetooth";
    case "net radio":
      return "mdi:radio";
    case "server":
      return "mdi:server";
    case "usb":
      return "mdi:usb";
    case "aux":
      return "mdi:audio-input-rca";
    case "hdmi":
      return "mdi:hdmi-port";
    case "tv":
      return "mdi:television";
    case "tuner":
      return "mdi:radio-tower";
    case "optical":
      return "mdi:audio-input-stereo-minijack";
    default:
      return "mdi:music";
  }
};
