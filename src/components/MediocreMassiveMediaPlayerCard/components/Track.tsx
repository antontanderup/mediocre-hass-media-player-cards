import { useMemo, useEffect, useState } from "preact/hooks";
import { ProgressBar, usePlayer } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  root: css({
    paddingLeft: "var(--mmpc-extra-horizontal-padding, 0px)",
    paddingRight: "var(--mmpc-extra-horizontal-padding, 0px)",
  }),
  timeWrap: css({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "4px",
    color: theme.colors.onDialogMuted,
    height: "20px",
    marginBottom: "-20px",
  }),
};

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
    <div css={styles.root}>
      <ProgressBar
        value={position.currentPosition}
        min={0}
        max={position.mediaDuration}
      />
      <div css={styles.timeWrap}>
        <span>{position.prettyNow}</span>
        <span>{position.prettyEnd}</span>
      </div>
    </div>
  );
};
