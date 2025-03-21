import { useContext, useMemo } from "preact/hooks";
import styled from "styled-components";
import { ProgressBar } from "../../ProgressBar";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../../MediaPlayerCommon";

const TrackWrap = styled.div`
  width: 100%;
`;

const TimeWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;

export const Track = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const mediaPosition = useMemo(() => {
    const player = hass.states[config.entity_id];
    const mediaPosition = player.attributes?.media_position ?? null;
    const mediaPositionUpdatedAt =
      player.attributes?.media_position_updated_at ?? null;
    const mediaDuration = player.attributes?.media_duration ?? null;
    if (
      mediaPosition === null ||
      mediaPosition < 0 ||
      mediaDuration === null ||
      mediaPositionUpdatedAt === null
    ) {
      return null;
    }

    const now = new Date();
    const lastUpdate = new Date(mediaPositionUpdatedAt);
    const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();
    const currentPosition = timeSinceLastUpdate / 1000 + mediaPosition;
    const getPrettyPrinted = (pos) => {
      const minutes = Math.floor(pos / 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.round(pos - Number(minutes) * 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    };

    return {
      currentPosition: currentPosition,
      mediaDuration: mediaDuration,
      prettyNow: getPrettyPrinted(currentPosition),
      prettyEnd: getPrettyPrinted(mediaDuration),
    };
  }, [hass, config]);

  if (!mediaPosition) {
    return null;
  }
  const { currentPosition, prettyEnd, prettyNow, mediaDuration } =
    mediaPosition;

  return (
    <TrackWrap>
      <ProgressBar value={currentPosition} min={0} max={mediaDuration} />
      <TimeWrap>
        <span>{prettyNow}</span>
        <span>{prettyEnd}</span>
      </TimeWrap>
    </TrackWrap>
  );
};
