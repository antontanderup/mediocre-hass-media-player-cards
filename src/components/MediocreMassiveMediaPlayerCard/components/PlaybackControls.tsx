import { useCallback, useContext } from "preact/hooks";
import { MediocreMassiveMediaPlayerCardConfig } from "../MediocreMassiveMediaPlayerCard";
import styled from "styled-components";
import { IconButton } from "../../IconButton";
import { CardContext, CardContextType } from "../../../utils";

const PlaybackControlsWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PlaybackControls = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const playing = hass.states[config.entity_id].state === "playing";
  const shuffle = hass.states[config.entity_id].attributes?.shuffle ?? false;
  const repeat: "one" | "all" | "off" =
    hass.states[config.entity_id].attributes?.repeat ?? "off";

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
      <IconButton
        size="small"
        onClick={toggleShuffle}
        Icon={shuffle ? "mdi:shuffle-variant" : "mdi:shuffle-disabled"}
      />
      <IconButton
        size="medium"
        onClick={previousTrack}
        Icon={"mdi:skip-previous"}
      />
      <IconButton
        size="large"
        onClick={togglePlayback}
        Icon={playing ? "mdi:pause-circle" : "mdi:play-circle"}
      />
      <IconButton size="medium" onClick={nextTrack} Icon={"mdi:skip-next"} />
      <IconButton
        size="small"
        onClick={toggleRepeat}
        Icon={
          repeat === "one"
            ? "mdi:repeat-once"
            : repeat === "all"
            ? "mdi:repeat"
            : "mdi:repeat-off"
        }
      />
    </PlaybackControlsWrap>
  );
};
