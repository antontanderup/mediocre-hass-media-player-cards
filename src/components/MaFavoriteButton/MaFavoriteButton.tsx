import { css } from "@emotion/react";
import { IconButton, Spinner, type ButtonSize } from "@components";
import { useMaFavoriteControl } from "@hooks";
import type { JSX } from "preact";

const styles = {
  active: css({
    color: "var(--mmpc-ma-favorite-active-color)",
  }),
  artworkOverlay: css({
    position: "absolute",
    top: "var(--mmpc-ma-favorite-inset-top, 14px)",
    right: "var(--mmpc-ma-favorite-inset-right, 14px)",
    zIndex: 2,
    pointerEvents: "auto",
    borderRadius: "999px",
    backdropFilter: "blur(6px)",
    color: "var(--mmpc-ma-favorite-inactive-color, #111)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    "@media (hover: hover)": {
      "&:hover": {
        backgroundColor: "var(--mmpc-ma-favorite-hover-background)",
      },
    },
  }),
  artworkOverlayInactive: css({
    backgroundColor: "rgba(235, 235, 235, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.45)",
  }),
  artworkOverlayActive: css({
    backgroundColor: "rgba(20, 20, 20, 0.66)",
    border: "1px solid rgba(255, 255, 255, 0.16)",
  }),
  artworkOverlayButton: css({
    appearance: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    padding: 4,
    minWidth: "var(--mmpc-ma-favorite-button-size)",
    minHeight: "var(--mmpc-ma-favorite-button-size)",
    color: "inherit",
    touchAction: "manipulation",
    "-webkit-tap-highlight-color": "transparent",
    "> ha-icon": {
      "--mdc-icon-size": "var(--mmpc-ma-favorite-button-size)",
      width: "var(--mmpc-ma-favorite-button-size)",
      height: "var(--mmpc-ma-favorite-button-size)",
      display: "flex",
      pointerEvents: "none",
    },
  }),
};

export const MaFavoriteButton = ({
  size = "small",
  placement = "inline",
}: {
  size?: ButtonSize;
  placement?: "inline" | "artwork";
}) => {
  const {
    activeColor,
    activeIcon,
    artworkInsetRight,
    artworkInsetTop,
    enabled,
    inactiveIcon,
    isFavorite,
    isLoading,
    toggleFavorite,
    unsupportedMessage,
  } = useMaFavoriteControl();

  if (!enabled) return null;

  if (placement === "artwork") {
    const handleOnClick: JSX.MouseEventHandler<HTMLDivElement> = event => {
      event.preventDefault();
      event.stopPropagation();
      void toggleFavorite();
    };
    const handleOnKeyDown: JSX.KeyboardEventHandler<HTMLDivElement> = event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      void toggleFavorite();
    };

    return (
      <div
        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        css={[
          styles.artworkOverlay,
          isFavorite ? styles.artworkOverlayActive : styles.artworkOverlayInactive,
          isFavorite && styles.active,
        ]}
        onClick={handleOnClick}
        onKeyDown={handleOnKeyDown}
        role="button"
        style={{
          "--mmpc-ma-favorite-active-color": activeColor,
          "--mmpc-ma-favorite-button-size": `${getButtonSize(size)}px`,
          "--mmpc-ma-favorite-inset-right": artworkInsetRight,
          "--mmpc-ma-favorite-inset-top": artworkInsetTop,
          "--mmpc-ma-favorite-hover-background": isFavorite
            ? "rgba(20, 20, 20, 0.8)"
            : "rgba(235, 235, 235, 0.62)",
          "--mmpc-ma-favorite-inactive-color": "#111111",
          "--icon-primary-color": isFavorite ? activeColor : "#111111",
          color: isFavorite ? activeColor : "#111111",
        }}
        tabIndex={0}
        title={unsupportedMessage}
      >
        <div css={styles.artworkOverlayButton}>
          {isLoading ? (
            <Spinner size={size} />
          ) : (
            <ha-icon icon={isFavorite ? activeIcon : inactiveIcon} />
          )}
        </div>
      </div>
    );
  }

  return (
    <IconButton
      css={[isFavorite && styles.active]}
      icon={isFavorite ? activeIcon : inactiveIcon}
      loading={isLoading}
      onClick={() => void toggleFavorite()}
      size={size}
      style={{
        "--mmpc-ma-favorite-active-color": activeColor,
        "--icon-primary-color": isFavorite ? activeColor : "#111111",
        color: isFavorite ? activeColor : "#111111",
      }}
      title={unsupportedMessage}
    />
  );
};

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case "xxx-small":
      return 8;
    case "xx-small":
      return 12;
    case "x-small":
      return 18;
    case "small":
      return 24;
    case "medium":
      return 32;
    case "large":
      return 48;
    case "x-large":
      return 80;
    case "xx-large":
      return 120;
  }
};
