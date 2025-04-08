import { useContext, useMemo } from "preact/hooks";
import styled from "@emotion/styled";
import { ProgressBar } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";

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
  const { hass, config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const position = useMemo(() => {
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
  }, [hass, config]);

  if (!position) {
    return null;
  }

  return (
    <div>
      <ProgressBar
        value={position.currentPosition}
        min={0}
        max={position.mediaDuration}
      />
      <TimeWrap>
        <span>{position.prettyNow}</span>
        <span>{position.prettyEnd}</span>
      </TimeWrap>
    </div>
  );
};
