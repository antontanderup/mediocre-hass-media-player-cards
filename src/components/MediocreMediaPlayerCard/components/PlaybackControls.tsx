import { useCallback, useContext } from "preact/hooks";
import {
  IconButton,
  CardContext,
  CardContextType,
  usePlayer,
} from "@components";
import { MediocreMediaPlayerCardConfig } from "@types";
import { useSupportedFeatures } from "@hooks";
import { getHass } from "@utils";
import { css } from "@emotion/react";

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
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

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
  } = useSupportedFeatures();

  const togglePlayback = useCallback(() => {
    getHass().callService("media_player", "media_play_pause", {
      entity_id: config.entity_id,
    });
  }, []);

  const nextTrack = useCallback(() => {
    getHass().callService("media_player", "media_next_track", {
      entity_id: config.entity_id,
    });
  }, []);

  const previousTrack = useCallback(() => {
    getHass().callService("media_player", "media_previous_track", {
      entity_id: config.entity_id,
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    getHass().callService("media_player", "shuffle_set", {
      entity_id: config.entity_id,
      shuffle: !shuffle,
    });
  }, [shuffle]);

  const toggleRepeat = useCallback(() => {
    const newRepeat =
      repeat === "off" ? "one" : repeat === "one" ? "all" : "off";
    getHass().callService("media_player", "repeat_set", {
      entity_id: config.entity_id,
      repeat: newRepeat,
    });
  }, [repeat]);

  return (
    <div css={styles.root}>
      {!!supportsShuffle && (
        <IconButton
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
          size="small"
          onClick={previousTrack}
          icon={"mdi:skip-previous"}
        />
      )}
      {supportsTogglePlayPause && (
        <IconButton
          size="medium"
          onClick={togglePlayback}
          icon={playing ? "mdi:pause-circle" : "mdi:play-circle"}
        />
      )}
      {!!supportNextTrack && (
        <IconButton size="small" onClick={nextTrack} icon={"mdi:skip-next"} />
      )}
      {!!supportsRepeat && (
        <IconButton
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
