import { useMemo, useEffect, useState } from "preact/hooks";
import styled from "@emotion/styled";
import { ProgressBar, usePlayer } from "@components";

const TrackWrap = styled.div`
  padding-left: var(--mmpc-extra-horizontal-padding, 0px);
  padding-right: var(--mmpc-extra-horizontal-padding, 0px);
`;

const TimeWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
  color: var(--secondary-text-color, #888);
  height: 20px;
  margin-bottom: -20px;
`;

export const Track = () => {
  const player = usePlayer();
  const [tick, setTick] = useState(0);
  const isPlaying = player.state === "playing";

  // Set up tick that updates once per second, but only when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const position = useMemo(() => {
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
    const getPrettyPrinted = pos => {
      const minutes = Math.floor(pos / 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.round(pos - Number(minutes) * 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    };

    return {
      currentPosition,
      mediaDuration,
      prettyNow: getPrettyPrinted(currentPosition),
      prettyEnd: getPrettyPrinted(mediaDuration),
    };
  }, [player, tick]); // Added tick to the dependency array to update when tick changes

  if (!position) {
    return null;
  }

  return (
    <TrackWrap>
      <ProgressBar
        value={position.currentPosition}
        min={0}
        max={position.mediaDuration}
      />
      <TimeWrap>
        <span>{position.prettyNow}</span>
        <span>{position.prettyEnd}</span>
      </TimeWrap>
    </TrackWrap>
  );
};
