import { useMemo } from "preact/hooks";
import type { SqueezeboxSongInfoLoopItem } from "@types";
import { usePlayer } from "@components/PlayerContext";
import { useSqueezeboxMoreInfo } from "@hooks";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { getIsLmsPlayer } from "@utils";

const styles = {
  trackInfo: css({
    display: "flex",
    flexDirection: "column",
    gap: 6,
    width: "100%",
  }),
  badgeRow: css({
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
  }),
  badge: css({
    display: "inline-flex",
    alignItems: "center",
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1,
    padding: "3px 8px",
    borderRadius: 10,
    color: theme.colors.onCard,
    backgroundColor: theme.colors.onCardDivider,
  }),
  badgeMuted: css({
    color: theme.colors.onCardMuted,
    backgroundColor: "transparent",
    border: `1px solid ${theme.colors.onCardDivider}`,
  }),
};

type LyrionTrackInfoProps = {
  lms_entity_id?: string;
};

export const LyrionTrackInfo = ({ lms_entity_id }: LyrionTrackInfoProps) => {
  const player = usePlayer();

  const isLmsPlayer = useMemo(
    () => !!(lms_entity_id && getIsLmsPlayer(player, lms_entity_id)),
    [player, lms_entity_id]
  );

  const { currentTrack } = useSqueezeboxMoreInfo({
    lms_entity_id: lms_entity_id ?? "",
    enabled: isLmsPlayer,
  });

  const lyrionTrackInfo = useMemo(
    () =>
      currentTrack?.songinfo_loop?.reduce<SqueezeboxSongInfoLoopItem>(
        (acc, item) => ({ ...acc, ...item }),
        {}
      ),
    [currentTrack]
  );

  if (!lyrionTrackInfo) return null;

  const trackPosition = (() => {
    if (!lyrionTrackInfo.tracknum) return null;
    const disc =
      lyrionTrackInfo.disc && lyrionTrackInfo.disccount
        ? `Disc ${lyrionTrackInfo.disc}/${lyrionTrackInfo.disccount} · `
        : lyrionTrackInfo.disc
          ? `Disc ${lyrionTrackInfo.disc} · `
          : "";
    return `${disc}Track ${lyrionTrackInfo.tracknum}`;
  })();

  const fileSize = (() => {
    const bytes = Number(lyrionTrackInfo.filesize);
    if (!bytes) return null;
    if (bytes >= 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  })();

  const audioBadges = [
    lyrionTrackInfo.type ? lyrionTrackInfo.type.toUpperCase() : null,
    lyrionTrackInfo.lossless === "1" ? "Lossless" : null,
    lyrionTrackInfo.samplerate
      ? `${Number(lyrionTrackInfo.samplerate) / 1000} kHz`
      : null,
    lyrionTrackInfo.samplesize ? `${lyrionTrackInfo.samplesize}-bit` : null,
    lyrionTrackInfo.bitrate && lyrionTrackInfo.bitrate !== "0"
      ? lyrionTrackInfo.bitrate
      : null,
    fileSize,
  ].filter(Boolean) as string[];

  const metaBadges = [
    lyrionTrackInfo.genre,
    lyrionTrackInfo.year,
    trackPosition,
    lyrionTrackInfo.playcount ? `${lyrionTrackInfo.playcount} plays` : null,
  ].filter(Boolean) as string[];

  return (
    <div css={styles.trackInfo}>
      {audioBadges.length > 0 && (
        <div css={styles.badgeRow}>
          {audioBadges.map(label => (
            <span key={label} css={styles.badge}>
              {label}
            </span>
          ))}
        </div>
      )}
      {metaBadges.length > 0 && (
        <div css={styles.badgeRow}>
          {metaBadges.map(label => (
            <span key={label} css={[styles.badge, styles.badgeMuted]}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
