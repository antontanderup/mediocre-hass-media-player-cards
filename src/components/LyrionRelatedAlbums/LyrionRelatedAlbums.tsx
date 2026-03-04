import { useCallback } from "preact/hooks";
import { MediaItem } from "@components/MediaSearch/components/MediaItem";
import { usePlayer } from "@components/PlayerContext";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { getHass } from "@utils";
import { useLyrionRelatedAlbums } from "./useLyrionRelatedAlbums";

const styles = {
  relatedSection: css({
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  }),
  relatedLabel: css({
    fontSize: 12,
    color: theme.colors.onCardMuted,
  }),
  relatedScroll: css({
    display: "flex",
    gap: 8,
    overflowX: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
  }),
  relatedItem: css({
    flex: "0 0 100px",
    width: 100,
  }),
};

type LyrionRelatedAlbumsProps = {
  entity_id: string;
  enabled?: boolean;
};

export const LyrionRelatedAlbums = ({
  entity_id,
  enabled,
}: LyrionRelatedAlbumsProps) => {
  const player = usePlayer();
  const artist = player.attributes.media_artist ?? "";

  const { albums } = useLyrionRelatedAlbums({
    entity_id,
    artist,
    enabled: enabled && !!artist,
  });

  const playAlbum = useCallback(
    async (albumId: string) => {
      await getHass().callService("lyrion_cli", "query", {
        command: "playlist loadtracks",
        entity_id,
        parameters: [`album.id=${albumId}`],
      });
    },
    [entity_id]
  );

  if (albums.length === 0) return null;

  return (
    <div css={styles.relatedSection}>
      <span css={styles.relatedLabel}>More by {artist}</span>
      <div css={styles.relatedScroll}>
        {albums.map(album => (
          <div key={album.id} css={styles.relatedItem}>
            <MediaItem
              imageUrl={album.thumbnail ?? null}
              mdiIcon="mdi:album"
              name={album.title}
              artist={album.subtitle}
              onClick={() => playAlbum(album.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
