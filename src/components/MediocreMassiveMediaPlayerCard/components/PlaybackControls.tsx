import { useCallback, useContext } from "preact/hooks";
import { IconButton, usePlayer } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import { useSupportedFeatures } from "@hooks";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { getHass } from "@utils";
import { css } from "@emotion/react";

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
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

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

  const stop = useCallback(() => {
    getHass().callService("media_player", "media_stop", {
      entity_id: config.entity_id,
    });
  }, [config]);

  const togglePlayback = useCallback(() => {
    getHass().callService("media_player", "media_play_pause", {
      entity_id: config.entity_id,
    });
  }, [config]);

  const nextTrack = useCallback(() => {
    getHass().callService("media_player", "media_next_track", {
      entity_id: config.entity_id,
    });
  }, [config]);

  const previousTrack = useCallback(() => {
    getHass().callService("media_player", "media_previous_track", {
      entity_id: config.entity_id,
    });
  }, [config]);

  const toggleShuffle = useCallback(() => {
    getHass().callService("media_player", "shuffle_set", {
      entity_id: config.entity_id,
      shuffle: !shuffle,
    });
  }, [shuffle, config]);

  const toggleRepeat = useCallback(() => {
    const newRepeat =
      repeat === "off" ? "one" : repeat === "one" ? "all" : "off";
    getHass().callService("media_player", "repeat_set", {
      entity_id: config.entity_id,
      repeat: newRepeat,
    });
  }, [repeat, config]);

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
