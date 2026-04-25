import { usePlayer } from "@components";
import { getHass } from "@utils";
import { useSupportedFeatures } from "@hooks/useSupportedFeatures";
import { useCallback, useMemo } from "preact/hooks";

export const usePlayerActions = () => {
  const {
    entity_id,
    state,
    attributes: { shuffle, repeat },
  } = usePlayer();

  const { supportsPause, supportsStop } = useSupportedFeatures();

  const stop = useCallback(() => {
    getHass().callService("media_player", "media_stop", {
      entity_id,
    });
  }, [entity_id]);

  const togglePlayback = useCallback(() => {
    if (supportsPause) {
      getHass().callService("media_player", "media_play_pause", { entity_id });
    } else if (state === "playing") {
      getHass().callService(
        "media_player",
        supportsStop ? "media_stop" : "media_pause",
        { entity_id }
      );
    } else {
      getHass().callService("media_player", "media_play", { entity_id });
    }
  }, [entity_id, state, supportsPause, supportsStop]);

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
