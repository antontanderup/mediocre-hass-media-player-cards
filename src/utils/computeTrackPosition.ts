export type TrackPosition = {
  currentPosition: number;
  mediaDuration: number;
  prettyNow: string;
  prettyEnd: string;
};

export const formatTrackTime = (
  seconds: number,
  forceHours: boolean = false
): string => {
  const totalSeconds = Math.floor(Math.max(0, seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (forceHours || hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export type TrackPlayerInput = {
  state?: string;
  attributes?: {
    media_position?: number;
    media_position_updated_at?: string;
    media_duration?: number;
  };
};

export const computeTrackPosition = (
  player: TrackPlayerInput,
  now: Date = new Date()
): TrackPosition | null => {
  const mediaPosition = player.attributes?.media_position ?? null;
  const mediaPositionUpdatedAt =
    player.attributes?.media_position_updated_at ?? null;
  const mediaDuration = player.attributes?.media_duration ?? null;

  if (
    mediaPosition === null ||
    mediaPosition < 0 ||
    mediaDuration === null ||
    mediaDuration <= 0
  ) {
    return null;
  }

  let currentPosition = mediaPosition;
  const isPlaying = player.state === "playing";

  if (isPlaying && mediaPositionUpdatedAt) {
    const lastUpdate = new Date(mediaPositionUpdatedAt).getTime();
    if (!isNaN(lastUpdate)) {
      const timeSinceLastUpdate = (now.getTime() - lastUpdate) / 1000;
      currentPosition += Math.max(0, timeSinceLastUpdate);
    }
  }

  currentPosition = Math.min(Math.max(0, currentPosition), mediaDuration);
  const showHours = mediaDuration >= 3600;

  return {
    currentPosition,
    mediaDuration,
    prettyNow: formatTrackTime(currentPosition, showHours),
    prettyEnd: formatTrackTime(mediaDuration, showHours),
  };
};
