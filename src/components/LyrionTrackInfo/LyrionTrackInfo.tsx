import { useMemo } from "preact/hooks";
import { usePlayer } from "@components/PlayerContext";
import { useSqueezeboxMoreInfo } from "@hooks";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { deriveLyrionTrackBadges, getIsLmsPlayer } from "@utils";

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

  const derived = useMemo(
    () => (currentTrack ? deriveLyrionTrackBadges(currentTrack) : null),
    [currentTrack]
  );

  if (!derived) return null;

  const { audioBadges, metaBadges } = derived;

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
