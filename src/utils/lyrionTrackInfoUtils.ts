import type { SqueezeboxSongInfoLoopItem } from "@types";

export function deriveLyrionTrackBadges(
  currentTrack: SqueezeboxSongInfoLoopItem
) {
  const trackPosition = (() => {
    if (!currentTrack.tracknum) return null;
    const disc =
      currentTrack.disc && currentTrack.disccount
        ? `Disc ${currentTrack.disc}/${currentTrack.disccount} · `
        : currentTrack.disc
          ? `Disc ${currentTrack.disc} · `
          : "";
    return `${disc}Track ${currentTrack.tracknum}`;
  })();

  const fileSize = (() => {
    const bytes = Number(currentTrack.filesize);
    if (!bytes) return null;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  })();

  const audioBadges = [
    currentTrack.type ? currentTrack.type.toUpperCase() : null,
    currentTrack.lossless === "1" ? "Lossless" : null,
    currentTrack.samplerate
      ? `${Number(currentTrack.samplerate) / 1000} kHz`
      : null,
    currentTrack.samplesize ? `${currentTrack.samplesize}-bit` : null,
    currentTrack.bitrate && currentTrack.bitrate !== "0"
      ? currentTrack.bitrate
      : null,
    fileSize,
  ].filter(Boolean) as string[];

  const metaBadges = [
    currentTrack.genre,
    currentTrack.year,
    trackPosition,
    currentTrack.playcount ? `${currentTrack.playcount} plays` : null,
  ].filter(Boolean) as string[];

  return { audioBadges, metaBadges };
}
