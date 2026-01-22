import { useCallback, useState } from "preact/hooks";
import { MediaImage } from "./MediaImage";
import { css } from "@emotion/react";
import {
  ButtonHTMLAttributes,
  DOMAttributes,
  TargetedMouseEvent,
} from "preact";
import { forwardRef } from "preact/compat";
import { isDarkMode } from "@utils";
import { ButtonSize, IconButton } from "@components";

const styles = {
  root: css({
    border: "none",
    cursor: "pointer",
    display: "grid",
    textAlign: "left",
    gridTemplateColumns: "50px 1fr auto",
    alignItems: "center",
    gap: 10,
    padding: "8px 8px",
    borderRadius: "8px",
    gridColumn: "1/-1",
    background: "rgba(255, 255, 255, 0.05)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
    containerType: "inline-size",
  }),
  rootLight: css({
    background: "rgba(0, 0, 0, 0.05)",
    "&:hover": {
      background: "rgba(0, 0, 0, 0.01)",
    },
  }),
  trackInfo: css({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    justifyContent: "space-evenly",
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
    borderRadius: 6,
  }),
  buttons: css({
    display: "flex",
    gap: "2px",
    marginRight: "8px",
    opacity: 0.7,
    ":hover &": {
      opacity: 1,
    },
  }),
  buttonPriority2: css({
    "@container (max-width: 300px)": {
      display: "none",
    },
  }),
  buttonPriority3: css({
    "@container (max-width: 350px)": {
      display: "none",
    },
  }),
};

export type MediaTrackProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "ref"
> & {
  imageUrl?: string | null;
  title: string;
  artist?: string;
  mdiIcon?: string | null;
  buttonIconSize?: ButtonSize;
  buttons?: {
    icon: string;
    onClick: () => void;
    disabled?: boolean;
    priority?: 1 | 2 | 3;
    size?: ButtonSize;
  }[];
};

export const MediaTrack = forwardRef<HTMLButtonElement, MediaTrackProps>(
  (
    {
      imageUrl,
      title,
      artist,
      mdiIcon,
      buttonIconSize = "x-small",
      onClick,
      buttons = [],
      ...buttonProps
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const handleOnClick: DOMAttributes<HTMLButtonElement>["onClick"] =
      useCallback(
        async (e: TargetedMouseEvent<HTMLButtonElement>) => {
          if (!onClick) return;
          if (
            typeof onClick === "function" &&
            onClick.constructor.name === "AsyncFunction"
          ) {
            setDone(false);
            setLoading(true);
            try {
              await onClick(e);
              setDone(true);
            } catch (error) {
              console.error("Error in MediaItem onClick:", error);
            }
            setLoading(false);
          } else {
            onClick(e);
          }
        },
        [onClick]
      );

    return (
      <button
        css={[styles.root, !isDarkMode() && styles.rootLight]}
        onClick={handleOnClick}
        {...buttonProps}
        ref={ref}
      >
        <MediaImage
          css={styles.mediaImage}
          imageUrl={imageUrl}
          loading={loading}
          mdiIcon={mdiIcon}
          done={done}
        />
        <div css={styles.trackInfo}>
          <div css={styles.trackName}>{title}</div>
          {!!artist && <div css={styles.trackArtist}>{artist}</div>}
        </div>
        {buttons.length > 0 && (
          <div css={styles.buttons}>
            {buttons.map((button, index) => (
              <IconButton
                css={[
                  button.priority === 3
                    ? styles.buttonPriority3
                    : button.priority === 2
                      ? styles.buttonPriority2
                      : undefined,
                ]}
                key={index + button.icon}
                disabled={button.disabled}
                icon={button.icon}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (button.disabled) {
                    return;
                  }
                  button.onClick();
                }}
                type="button"
                size={button.size ?? buttonIconSize}
              />
            ))}
          </div>
        )}
      </button>
    );
  }
);
