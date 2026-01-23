import { IconButton, usePlayer } from "@components";
import { useSupportedFeatures } from "@hooks";
import { css } from "@emotion/react";
import { usePlayerActions } from "@hooks/usePlayerActions";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingLeft: "var(--mmpc-extra-horizontal-padding, 0px)",
    paddingRight: "var(--mmpc-extra-horizontal-padding, 0px)",
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
      {supportsShuffle && (
        <IconButton
          size="small"
          onClick={toggleShuffle}
          icon={shuffle ? "mdi:shuffle-variant" : "mdi:shuffle-disabled"}
        />
      )}
      {supportPreviousTrack && (
        <IconButton
          size="large"
          onClick={previousTrack}
          icon={"mdi:skip-previous"}
        />
      )}
      {supportsTogglePlayPause ? (
        <IconButton
          size="x-large"
          onClick={togglePlayback}
          icon={playing ? "mdi:pause-circle" : "mdi:play-circle"}
        />
      ) : supportsStop ? (
        <IconButton size="x-large" onClick={stop} icon={"mdi:stop"} />
      ) : null}
      {supportNextTrack && (
        <IconButton size="large" onClick={nextTrack} icon={"mdi:skip-next"} />
      )}
      {supportsRepeat && (
        <IconButton
          size="small"
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
