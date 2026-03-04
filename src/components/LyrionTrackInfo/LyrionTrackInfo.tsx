import { useMemo } from "preact/hooks";
import type { SqueezeboxSongInfoLoopItem } from "@types";
import { usePlayer } from "@components/PlayerContext";
import { useSqueezeboxMoreInfo } from "@hooks";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { getIsLmsPlayer } from "@utils";
import { Fragment } from "preact/jsx-runtime";
import { LyrionRelatedAlbums } from "@components/LyrionRelatedAlbums";

const styles = {
  trackInfo: css({
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "100%",
  }),
  trackInfoRow: css({
    display: "flex",
    gap: 8,
    fontSize: 14,
    color: theme.colors.onCard,
  }),
  trackInfoLabel: css({
    color: theme.colors.onCardMuted,
    minWidth: 80,
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

  return (
    <Fragment>
      <div css={styles.trackInfo}>
        {lyrionTrackInfo.type && (
          <div css={styles.trackInfoRow}>
            <span css={styles.trackInfoLabel}>Format</span>
            <span>
              {[
                lyrionTrackInfo.type,
                lyrionTrackInfo.bitrate && lyrionTrackInfo.bitrate !== "0"
                  ? lyrionTrackInfo.bitrate
                  : null,
                lyrionTrackInfo.lossless === "1" ? "Lossless" : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        )}
        {!lyrionTrackInfo.type &&
          lyrionTrackInfo.bitrate &&
          lyrionTrackInfo.bitrate !== "0" && (
            <div css={styles.trackInfoRow}>
              <span css={styles.trackInfoLabel}>Bitrate</span>
              <span>{lyrionTrackInfo.bitrate}</span>
            </div>
          )}
        {(lyrionTrackInfo.samplerate || lyrionTrackInfo.samplesize) && (
          <div css={styles.trackInfoRow}>
            <span css={styles.trackInfoLabel}>Quality</span>
            <span>
              {[
                lyrionTrackInfo.samplerate
                  ? `${Number(lyrionTrackInfo.samplerate) / 1000} kHz`
                  : null,
                lyrionTrackInfo.samplesize
                  ? `${lyrionTrackInfo.samplesize}-bit`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        )}
        {lyrionTrackInfo.year && (
          <div css={styles.trackInfoRow}>
            <span css={styles.trackInfoLabel}>Year</span>
            <span>{lyrionTrackInfo.year}</span>
          </div>
        )}
        {lyrionTrackInfo.genre && (
          <div css={styles.trackInfoRow}>
            <span css={styles.trackInfoLabel}>Genre</span>
            <span>{lyrionTrackInfo.genre}</span>
          </div>
        )}
        {lyrionTrackInfo.playcount && (
          <div css={styles.trackInfoRow}>
            <span css={styles.trackInfoLabel}>Plays</span>
            <span>{lyrionTrackInfo.playcount}</span>
          </div>
        )}
      </div>
      <LyrionRelatedAlbums
        entity_id={lms_entity_id ?? ""}
        enabled={isLmsPlayer}
      />
    </Fragment>
  );
};
