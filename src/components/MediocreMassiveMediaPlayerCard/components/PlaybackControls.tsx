import { useCallback, useContext } from "preact/hooks";
import styled from "@emotion/styled";
import { IconButton, useHass, usePlayer } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import { useSupportedFeatures } from "@hooks";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";

const PlaybackControlsWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`;

export const PlaybackControls = () => {
  const hass = useHass();
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
  } = useSupportedFeatures();

  const togglePlayback = useCallback(() => {
    hass.callService("media_player", "media_play_pause", {
      entity_id: config.entity_id,
    });
  }, []);

  const nextTrack = useCallback(() => {
    hass.callService("media_player", "media_next_track", {
      entity_id: config.entity_id,
    });
  }, []);

  const previousTrack = useCallback(() => {
    hass.callService("media_player", "media_previous_track", {
      entity_id: config.entity_id,
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    hass.callService("media_player", "shuffle_set", {
      entity_id: config.entity_id,
      shuffle: !shuffle,
    });
  }, [shuffle]);

  const toggleRepeat = useCallback(() => {
    const newRepeat =
      repeat === "off" ? "one" : repeat === "one" ? "all" : "off";
    hass.callService("media_player", "repeat_set", {
      entity_id: config.entity_id,
      repeat: newRepeat,
    });
  }, [repeat]);

  return (
    <PlaybackControlsWrap>
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
      {supportsTogglePlayPause && (
        <IconButton
          size="x-large"
          onClick={togglePlayback}
          icon={playing ? "mdi:pause-circle" : "mdi:play-circle"}
        />
      )}
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
    </PlaybackControlsWrap>
  );
};
