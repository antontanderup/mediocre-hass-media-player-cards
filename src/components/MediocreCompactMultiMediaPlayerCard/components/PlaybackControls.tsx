import { IconButton, usePlayer } from "@components";
import { useSupportedFeatures } from "@hooks";
import { css } from "@emotion/react";
import { usePlayerActions } from "@hooks/usePlayerActions";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "auto",
    height: "36px", // fixed to prevent jumping
    marginLeft: "-4px", // compensate for icon button padding
  }),
  buttonMuted: css({
    opacity: 0.8,
  }),
  shuffleButton: css({
    "@container (max-width: 150px)": {
      display: "none",
    },
  }),
  repeatButton: css({
    "@container (max-width: 130px)": {
      display: "none",
    },
  }),
};

export const PlaybackControls = () => {
  const {
    attributes: { shuffle, repeat },
    state,
  } = usePlayer();

  const playing = state === "playing";

  const {
    supportPreviousTrack,
    supportNextTrack,
    supportsShuffle,
    supportsRepeat,
    supportsTogglePlayPause,
    supportsStop,
  } = useSupportedFeatures();

  const {
    togglePlayback,
    toggleRepeat,
    toggleShuffle,
    previousTrack,
    nextTrack,
    stop,
  } = usePlayerActions();

  return (
    <div css={styles.root}>
      {!!supportsShuffle && (
        <IconButton
          id="mmpc-compact-shuffle-toggle"
          css={[
            styles.shuffleButton,
            ...(!shuffle ? [styles.buttonMuted] : []),
          ]}
          size="x-small"
          onClick={toggleShuffle}
          icon={shuffle ? "mdi:shuffle-variant" : "mdi:shuffle-disabled"}
        />
      )}
      {!!supportPreviousTrack && (
        <IconButton
          id="mmpc-compact-previous-track"
          size="small"
          onClick={previousTrack}
          icon={"mdi:skip-previous"}
        />
      )}
      {supportsTogglePlayPause ? (
        <IconButton
          id="mmpc-compact-play-pause-toggle"
          size="medium"
          onClick={togglePlayback}
          icon={playing ? "mdi:pause-circle" : "mdi:play-circle"}
        />
      ) : supportsStop ? (
        <IconButton
          id="mmpc-compact-stop"
          size="medium"
          onClick={stop}
          icon={"mdi:stop"}
        />
      ) : null}
      {!!supportNextTrack && (
        <IconButton
          id="mmpc-compact-next-track"
          size="small"
          onClick={nextTrack}
          icon={"mdi:skip-next"}
        />
      )}
      {!!supportsRepeat && (
        <IconButton
          id="mmpc-compact-repeat-toggle"
          css={[
            styles.repeatButton,
            ...(repeat === "off" ? [styles.buttonMuted] : []),
          ]}
          size="x-small"
          onClick={toggleRepeat}
          icon={
            repeat === "one"
              ? "mdi:repeat-once"
              : repeat === "all"
                ? "mdi:repeat"
                : "mdi:repeat-off"
          }
        />
      )}
    </div>
  );
};
