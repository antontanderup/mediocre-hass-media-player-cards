import { useCallback, useContext } from "preact/hooks";
import styled from "@emotion/styled";
import {
  IconButton,
  CardContext,
  CardContextType,
  usePlayer,
} from "@components";
import { MediocreMediaPlayerCardConfig } from "@types";
import { useSupportedFeatures } from "@hooks";
import { getHass } from "@utils";

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

// Hide shuffle and repeat buttons at small sizes
const ShuffleButton = styled(ControlButton)`
  @container (max-width: 150px) {
    display: none;
  }
`;

const RepeatButton = styled(ControlButton)`
  @container (max-width: 130px) {
    display: none;
  }
`;

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
    <PlaybackControlsWrap>
      {!!supportsShuffle && (
        <ShuffleButton
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
        <RepeatButton
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
