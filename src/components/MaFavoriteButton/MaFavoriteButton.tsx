import { css } from "@emotion/react";
import { Spinner } from "@components/Spinner";
import { JSX } from "preact";
import { useMaFavoriteControl } from "@hooks";

const NON_LIBRARY_FAVORITE_MESSAGE =
  "For non-library items, favoriting may take a few minutes to appear.";
const NON_LIBRARY_UNFAVORITE_MESSAGE =
  "Unfavorite is only available for library tracks.";

const styles = {
  container: css({
    position: "absolute",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
    pointerEvents: "none",
  }),
  root: css({
    pointerEvents: "auto",
    borderRadius: "999px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(6px)",
    color: "var(--mmpc-ma-favorite-color)",
    "@media (hover: hover)": {
      "&:hover": {
        backgroundColor: "var(--mmpc-ma-favorite-hover-background)",
      },
    },
    transition: "opacity 120ms ease, transform 120ms ease",
  }),
  active: css({
    backgroundColor: "rgba(20, 20, 20, 0.66)",
    border: "1px solid rgba(255, 255, 255, 0.16)",
  }),
  inactive: css({
    backgroundColor: "rgba(235, 235, 235, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.45)",
  }),
  button: css({
    position: "relative",
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
  busyIcon: css({
    opacity: 0.35,
  }),
  spinnerOverlay: css({
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  }),
};

const fireHassNotification = (message: string) => {
  document.body?.dispatchEvent(
    new CustomEvent("hass-notification", {
      bubbles: true,
      composed: true,
      detail: { message },
    })
  );
};

const getOffsetPosition = (offset: string) => {
  const parts = offset
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const [xOffset, yOffset] =
    parts.length >= 2
      ? [parts[0], parts[1]]
      : [parts[0] || "14px", parts[0] || "14px"];

  return {
    right: xOffset,
    top: yOffset,
  };
};

const getButtonSize = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "medium":
      return 32;
    case "large":
      return 40;
    case "small":
    default:
      return 24;
  }
};

export const MaFavoriteButton = () => {
  const {
    activeColor,
    enabled,
    favoriteButtonOffset,
    favoriteButtonSize,
    inactiveColor,
    isLibraryItem,
    isFavorite,
    isLoading,
    toggleFavorite,
    unsupportedMessage,
  } = useMaFavoriteControl();

  if (!enabled) return null;

  const handleOnClick: JSX.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return;
    if (!isLibraryItem && isFavorite) {
      fireHassNotification(NON_LIBRARY_UNFAVORITE_MESSAGE);
      return;
    }
    if (!isLibraryItem) {
      fireHassNotification(NON_LIBRARY_FAVORITE_MESSAGE);
    }
    void toggleFavorite();
  };

  const handleOnKeyDown: JSX.KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return;
    if (!isLibraryItem && isFavorite) {
      fireHassNotification(NON_LIBRARY_UNFAVORITE_MESSAGE);
      return;
    }
    if (!isLibraryItem) {
      fireHassNotification(NON_LIBRARY_FAVORITE_MESSAGE);
    }
    void toggleFavorite();
  };

  return (
    <div
      css={styles.container}
      style={{
        ...getOffsetPosition(favoriteButtonOffset),
      }}
    >
      <div
        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        aria-busy={isLoading}
        css={[styles.root, isFavorite ? styles.active : styles.inactive]}
        onClick={handleOnClick}
        onKeyDown={handleOnKeyDown}
        role="button"
        style={{
          "--mmpc-ma-favorite-button-size": `${getButtonSize(
            favoriteButtonSize
          )}px`,
          "--mmpc-ma-favorite-color": isFavorite ? activeColor : inactiveColor,
          "--mmpc-ma-favorite-hover-background": isFavorite
            ? "rgba(20, 20, 20, 0.8)"
            : "rgba(235, 235, 235, 0.62)",
          "--icon-primary-color": isFavorite ? activeColor : inactiveColor,
          color: isFavorite ? activeColor : inactiveColor,
          cursor:
            !isLibraryItem && isFavorite
              ? "not-allowed"
              : isLoading
                ? "progress"
                : "pointer",
          opacity: isLoading ? 0.72 : 1,
        }}
        tabIndex={0}
        title={unsupportedMessage}
      >
        <div css={styles.button}>
          <ha-icon
            css={isLoading ? styles.busyIcon : undefined}
            icon={isFavorite ? "mdi:star" : "mdi:star-outline"}
          />
          {isLoading ? (
            <div css={styles.spinnerOverlay}>
              <Spinner size={favoriteButtonSize} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
