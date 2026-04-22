import { usePlayer } from "@components";
import { getHass } from "@utils";
import { useCallback, useMemo } from "preact/hooks";

export const usePlayerActions = () => {
  const {
    entity_id,
    state,
    attributes: { shuffle, repeat, supported_features: supportedFeatures },
  } = usePlayer();

  const stop = useCallback(() => {
    getHass().callService("media_player", "media_stop", {
      entity_id,
    });
  }, [entity_id]);

  const togglePlayback = useCallback(() => {
    const supportsPause =
      supportedFeatures !== undefined && (supportedFeatures & 1) === 1;
    if (supportsPause || supportedFeatures === undefined) {
      getHass().callService("media_player", "media_play_pause", { entity_id });
    } else if (state === "playing") {
      const supportsStop = (supportedFeatures & 4096) === 4096;
      getHass().callService(
        "media_player",
        supportsStop ? "media_stop" : "media_pause",
        { entity_id }
      );
    } else {
      getHass().callService("media_player", "media_play", { entity_id });
    }
  }, [entity_id, state, supportedFeatures]);

  const nextTrack = useCallback(() => {
    getHass().callService("media_player", "media_next_track", {
      entity_id,
    });
  }, [entity_id]);

  const previousTrack = useCallback(() => {
    getHass().callService("media_player", "media_previous_track", {
      entity_id,
    });
  }, [entity_id]);

  const toggleShuffle = useCallback(() => {
    getHass().callService("media_player", "shuffle_set", {
      entity_id,
      shuffle: !shuffle,
    });
  }, [entity_id, shuffle]);

  const toggleRepeat = useCallback(() => {
    const newRepeat =
      repeat === "off" ? "one" : repeat === "one" ? "all" : "off";
    getHass().callService("media_player", "repeat_set", {
      entity_id,
      repeat: newRepeat,
    });
  }, [entity_id, repeat]);

  const togglePower = useCallback(() => {
    getHass().callService("media_player", "toggle", {
      entity_id,
    });
  }, [entity_id]);

  return useMemo(
    () => ({
      stop,
      togglePlayback,
      nextTrack,
      previousTrack,
      toggleShuffle,
      toggleRepeat,
      togglePower,
    }),
    [
      stop,
      togglePlayback,
      nextTrack,
      previousTrack,
      toggleShuffle,
      toggleRepeat,
      togglePower,
    ]
  );
};
