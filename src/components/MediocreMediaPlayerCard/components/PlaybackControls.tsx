import { useCallback, useContext } from "preact/hooks";
import styled from "@emotion/styled";
import { IconButton } from "../../IconButton";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../../MediaPlayerCommon/config";
import { useSupportedFeatures } from "../../../hooks/useSupportedFeatures";

const PlaybackControlsWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: auto;
  height: 36px; // fixed to prevent jumping
  margin-left: -4px; // compensate for icon button padding
`;

const ControlButton = styled(IconButton)<{ muted?: boolean }>`
  opacity: ${props => (props.muted ? 0.8 : 1)}; // reduce opacity if muted
`;

export const PlaybackControls = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id } = config;
  const player = hass.states[entity_id];
  const {
    attributes: { shuffle, repeat },
  } = player;

  const playing = player.state === "playing";

  const {
    supportPreviousTrack,
    supportNextTrack,
    supportsShuffle,
    supportsRepeat,
    supportsTogglePlayPause,
  } = useSupportedFeatures(player);

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
      {!!supportsShuffle && (
        <ControlButton
          size="x-small"
          onClick={toggleShuffle}
          muted={!shuffle}
          icon={shuffle ? "mdi:shuffle-variant" : "mdi:shuffle-disabled"}
        />
      )}
      {!!supportPreviousTrack && (
        <ControlButton
          size="small"
          onClick={previousTrack}
          icon={"mdi:skip-previous"}
        />
      )}
      {supportsTogglePlayPause && (
        <ControlButton
          size="medium"
          onClick={togglePlayback}
          icon={playing ? "mdi:pause-circle" : "mdi:play-circle"}
        />
      )}
      {!!supportNextTrack && (
        <ControlButton
          size="small"
          onClick={nextTrack}
          icon={"mdi:skip-next"}
        />
      )}
      {!!supportsRepeat && (
        <ControlButton
          size="x-small"
          onClick={toggleRepeat}
          muted={repeat === "off"}
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
