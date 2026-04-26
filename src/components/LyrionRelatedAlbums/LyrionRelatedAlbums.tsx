import { useCallback } from "preact/hooks";
import { MediaItem } from "@components/MediaSearch/components/MediaItem";
import { usePlayer } from "@components/PlayerContext";
import { useIntl } from "@components/i18n";
import { css } from "@emotion/react";
import { getHass } from "@utils";
import { OverlayMenu } from "@components/OverlayMenu/OverlayMenu";
import type { HaEnqueueMode } from "@components/HaSearch/types";
import { getEnqueueModeIcon } from "@components/HaMediaBrowser";
import { useLyrionRelatedAlbums } from "./useLyrionRelatedAlbums";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
    containerType: "inline-size",
  }),
  relatedScroll: css({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    width: "100%",
    "@container (min-width: 300px)": {
      gridTemplateColumns: "repeat(4, 1fr)",
    },
    "@container (min-width: 500px)": {
      gridTemplateColumns: "repeat(6, 1fr)",
    },
  }),
};

type LyrionRelatedAlbumsProps = {
  entity_id: string;
  renderHeader: () => preact.JSX.Element;
  enabled?: boolean;
};

export const LyrionRelatedAlbums = ({
  entity_id,
  renderHeader,
  enabled,
}: LyrionRelatedAlbumsProps) => {
  const player = usePlayer();
  const artist = player.attributes.media_artist ?? "";

  const { t } = useIntl();

  const { albums } = useLyrionRelatedAlbums({
    entity_id,
    artist,
    enabled: enabled && !!artist,
  });

  const playAlbum = useCallback(
    (albumId: string, enqueue?: HaEnqueueMode) => {
      let action = "loadtracks";
      if (enqueue === "next") action = "inserttracks";
      else if (enqueue === "add") action = "addtracks";
      else if (enqueue === "replace") action = "loadtracks";
      getHass().callService("squeezebox", "call_method", {
        command: "playlist",
        entity_id,
        parameters: [action, `album.id=${albumId}`],
      });
    },
    [entity_id]
  );

  if (albums.length === 0) return null;

  return (
    <div css={styles.root}>
      {renderHeader()}
      <div css={styles.relatedScroll}>
        {albums.map(album => (
          <OverlayMenu
            key={album.id}
            menuItems={[
              {
                label: t({
                  id: "MediaBrowser.media_item_menu.enqueue_mode.play",
                  defaultMessage: "Play",
                }),
                icon: getEnqueueModeIcon("play"),
                onClick: () => playAlbum(album.id),
              },
              {
                label: t({
                  id: "MediaBrowser.media_item_menu.enqueue_dropdown_label",
                  defaultMessage: "Enqueue",
                }),
                icon: getEnqueueModeIcon("next"),
                children: [
                  {
                    label: t({
                      id: "MediaBrowser.media_item_menu.enqueue_mode.next",
                      defaultMessage: "Play Next",
                    }),
                    icon: getEnqueueModeIcon("next"),
                    onClick: () => playAlbum(album.id, "next"),
                  },
                  {
                    label: t({
                      id: "MediaBrowser.media_item_menu.enqueue_mode.replace",
                      defaultMessage: "Replace Queue",
                    }),
                    icon: getEnqueueModeIcon("replace"),
                    onClick: () => playAlbum(album.id, "replace"),
                  },
                  {
                    label: t({
                      id: "MediaBrowser.media_item_menu.enqueue_mode.add",
                      defaultMessage: "Add to Queue",
                    }),
                    icon: getEnqueueModeIcon("add"),
                    onClick: () => playAlbum(album.id, "add"),
                  },
                ],
              },
            ]}
            renderTrigger={triggerProps => (
              <MediaItem
                imageUrl={album.thumbnail ?? null}
                mdiIcon="mdi:album"
                name={album.title}
                artist={album.subtitle}
                {...triggerProps}
              />
            )}
          />
        ))}
      </div>
    </div>
  );
};
