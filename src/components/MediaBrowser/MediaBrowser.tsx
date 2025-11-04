import {
  MediaGrid,
  MediaItem,
  MediaTrack,
  searchStyles,
  Spinner,
  VirtualList,
} from "@components";
import { HaEnqueueMode } from "@components/HaSearch/types";
import { IconButton } from "@components/IconButton";
import {
  OverlayMenu,
  OverlayMenuItem,
} from "@components/OverlayMenu/OverlayMenu";
import { css } from "@emotion/react";
import { getHass } from "@utils";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";

export type MediaBrowserProps = {
  entity_id: string;
  horizontalPadding?: number;
};

export enum MediaContentType {
  Favorites = "favorites",
  Artists = "artists",
  Albums = "albums",
  Tracks = "tracks",
  Playlists = "playlists",
  Genres = "genres",
  NewMusic = "new music",
  AlbumArtists = "album artists",
  Apps = "apps",
  Radios = "radios",
  App = "app",
  Track = "track",
}

// Media class enum
export enum MediaClass {
  Track = "track",
  Artist = "artist",
  Album = "album",
  Playlist = "playlist",
  Genre = "genre",
  App = "app",
  Directory = "directory",
}

const styles = {
  header: css({
    marginBottom: 16,
  }),
  navigationBar: css({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "8px 16px",
    color: "var(--primary-text-color, #fff)",
    borderBottom: `0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12))`,
  }),
  breadCrumbs: css({
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    alignItems: "center",
    overflowX: "auto",
    maxWidth: "calc(100% - 40px)",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),
  breadCrumbItem: css({
    background: "none",
    border: "none",
    color: "var(--primary-text-color, #fff)",
    cursor: "pointer",
    padding: "2px 4px",
    whiteSpace: "nowrap",
    fontSize: "0.9rem",
    "&:hover": {
      textDecoration: "underline",
    },
  }),
  breadCrumbSeparator: css({
    color: "var(--secondary-text-color)",
  }),
  noMediaText: css({
    padding: "16px",
    paddingBottom: "32px",
    color: "var(--secondary-text-color)",
    textAlign: "center",
  }),
};

export type MediaBrowserItem = {
  title: string;
  media_class: MediaClass | string;
  media_content_type: MediaContentType | string;
  media_content_id: string;
  children_media_class: MediaClass | null;
  can_play: boolean;
  can_expand: boolean;
  thumbnail: string | null;
};

export const MediaBrowser = ({
  entity_id,
  horizontalPadding,
}: MediaBrowserProps) => {
  const [mediaBrowserItems, setMediaBrowserItems] = useState<
    MediaBrowserItem[]
  >([]);
  const [history, setHistory] = useState<MediaBrowserItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [chunkSize, setChunkSize] = useState(4);

  const items: MediaBrowserItem[][] = useMemo(() => {
    const result: MediaBrowserItem[][] = [];
    const groupedByType: Record<"track" | "expandable", MediaBrowserItem[]> = {
      track: [],
      expandable: [],
    };

    // Group items by media_content_type
    mediaBrowserItems.forEach(item => {
      const isTrack =
        item.media_content_type === MediaContentType.Tracks ||
        item.media_class === MediaClass.Track;
      const type = isTrack && !(history.length === 0) ? "track" : "expandable";
      if (!groupedByType[type]) {
        groupedByType[type] = [];
      }
      groupedByType[type].push(item);
    });

    // Process each group
    Object.entries(groupedByType).forEach(([mediaType, items]) => {
      // Add items based on media_class
      if (mediaType === "track" && history.length !== 0) {
        // Tracks are added individually
        items.forEach(item => {
          result.push([item]);
        });
      } else {
        // Other media types are grouped in rows of 4
        for (let i = 0; i < items.length; i += chunkSize) {
          const chunk = items.slice(i, i + chunkSize);
          result.push(chunk);
        }
      }
    });

    return result;
  }, [mediaBrowserItems, chunkSize]);

  useEffect(() => {
    const fetchMediaBrowserItems = async () => {
      setIsFetching(true);
      try {
        const hass = getHass();
        const response = (await hass.callWS({
          type: "media_player/browse_media",
          entity_id,
          ...(history.length > 0
            ? {
                media_content_id: history[history.length - 1].media_content_id,
                media_content_type:
                  history[history.length - 1].media_content_type,
              }
            : {}),
        })) as { children?: MediaBrowserItem[] };

        if (response && response.children) {
          setMediaBrowserItems(response.children);
          console.log("Media items:", response.children);
        } else {
          setMediaBrowserItems([]);
        }
      } catch (error) {
        console.error("Error fetching media items:", error);
      }
      setIsFetching(false);
    };

    fetchMediaBrowserItems();
  }, [entity_id, history]);

  const playItem = useCallback(
    (item: MediaBrowserItem, enqueue?: HaEnqueueMode) => {
      try {
        getHass().callService("media_player", "play_media", {
          entity_id,
          media_content_type: item.media_content_type,
          media_content_id: item.media_content_id,
          enqueue,
        });
      } catch (error) {
        console.error(
          "Error playing media item:",
          {
            entity_id,
            media_content_type: item.media_content_type,
            media_content_id: item.media_content_id,
          },
          error
        );
      }
    },
    [entity_id]
  );

  const onMediaBrowserItemClick = useCallback(
    (item: MediaBrowserItem) => {
      if (isFetching) return;
      if (
        item.can_expand &&
        item.media_content_id !== history[history.length - 1]?.media_content_id
      ) {
        setHistory(prev => [...prev, item]);
        return;
      }
    },
    [history, isFetching]
  );

  const goBack = useCallback(() => {
    if (isFetching) return;
    if (history.length > 0) {
      setHistory(prev => prev.slice(0, -1));
    }
  }, [isFetching]);

  const goToIndex = useCallback(
    (index: number) => {
      if (isFetching) return;
      setHistory(prev => prev.slice(0, index + 1));
    },
    [isFetching]
  );

  const getItemOverlayMenuItems = useCallback((item: MediaBrowserItem) => {
    const menuItems: OverlayMenuItem[] = [];
    if (item.can_play) {
      menuItems.push({
        label: "Play",
        children: [
          {
            label: "Play",
            onClick: () => playItem(item, "play"),
          },
          {
            label: "Play Next",
            onClick: () => playItem(item, "next"),
          },
          {
            label: "Replace Queue",
            onClick: () => playItem(item, "replace"),
          },
          {
            label: "Add to Queue",
            onClick: () => playItem(item, "add"),
          },
        ],
      });
    }
    if (item.can_expand) {
      menuItems.push({
        label: "Browse",
        onClick: () => onMediaBrowserItemClick(item),
      });
    }
    return menuItems;
  }, []);

  const renderTrack = (item: MediaBrowserItem) => {
    if (history.length === 0) return renderFolder(item);
    return (
      <OverlayMenu
        menuItems={getItemOverlayMenuItems(item)}
        renderTrigger={triggerProps => (
          <MediaTrack
            key={item.media_content_id + history.length}
            title={item.title}
            imageUrl={item.thumbnail}
            {...triggerProps}
          />
        )}
      />
    );
  };

  const renderFolder = (item: MediaBrowserItem) => {
    if (!item.can_play) {
      return (
        <MediaItem
          key={item.media_content_id + history.length}
          name={item.title}
          imageUrl={item.thumbnail}
          mdiIcon={getItemMdiIcon(item)}
          onClick={() => onMediaBrowserItemClick(item)}
        />
      );
    }
    return (
      <OverlayMenu
        menuItems={getItemOverlayMenuItems(item)}
        renderTrigger={triggerProps => (
          <MediaItem
            key={item.media_content_id + history.length}
            name={item.title}
            imageUrl={item.thumbnail}
            mdiIcon={getItemMdiIcon(item)}
            {...triggerProps}
          />
        )}
      />
    );
  };

  const renderItem = (item: MediaBrowserItem[]) => {
    return (
      <MediaGrid numberOfColumns={chunkSize}>
        {item.map(mediaItem => {
          return (item[0].media_class === MediaClass.Track ||
            item[0].media_content_type === MediaContentType.Track) &&
            mediaItem.media_content_type !== "favorite"
            ? renderTrack(mediaItem)
            : renderFolder(mediaItem);
        })}
      </MediaGrid>
    );
  };

  return (
    <div
      css={searchStyles.root}
      style={{
        "--mmpc-search-padding": `${horizontalPadding}px`,
      }}
    >
      <VirtualList
        key={history[history.length - 1]?.media_content_id || "root"}
        onLayout={({ width }) => {
          if (width > 800) {
            setChunkSize(6);
          } else if (width > 390) {
            setChunkSize(4);
          } else {
            setChunkSize(3);
          }
        }}
        renderItem={renderItem}
        renderHeader={() => (
          <div css={styles.header}>
            {history.length > 0 && (
              <Fragment>
                <div css={styles.navigationBar}>
                  <IconButton
                    icon="mdi:arrow-left"
                    size="x-small"
                    onClick={goBack}
                    disabled={history.length === 0}
                  />
                  <div css={styles.breadCrumbs}>
                    <button
                      css={styles.breadCrumbItem}
                      onClick={() => setHistory([])}
                    >
                      Home
                    </button>
                    {history.map((item, index) => (
                      <Fragment key={`breadcrumb-${index}-${item.title}`}>
                        <span css={styles.breadCrumbSeparator}>/</span>
                        <button
                          css={styles.breadCrumbItem}
                          onClick={() => goToIndex(index)}
                        >
                          {item.title}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        )}
        renderEmpty={() => {
          if (isFetching) return <Spinner />;
          if (!isFetching && mediaBrowserItems.length === 0) {
            return (
              <div css={styles.noMediaText}>No media items available.</div>
            );
          }
          return null;
        }}
        data={items}
      />
    </div>
  );
};

const getItemMdiIcon = (item: MediaBrowserItem) => {
  if (item.thumbnail) return null;
  // this function is a little silly because it seems like there's no real standard way to declare these

  switch (item.media_content_type) {
    case MediaContentType.Albums:
      return "mdi:album";
    case MediaContentType.Artists:
      return "mdi:account-music";
    case MediaContentType.Tracks:
      return "mdi:music-note";
    case MediaContentType.Playlists:
      return "mdi:playlist-music";
    case MediaContentType.Genres:
      return "mdi:music-box-multiple";
    case MediaContentType.App:
      return "mdi:application";
    case MediaContentType.Favorites:
      return "mdi:star";
    case MediaContentType.NewMusic:
    case MediaContentType.AlbumArtists:
    case MediaContentType.Radios:
    default:
      break;
  }

  switch (item.media_class) {
    case MediaClass.Album:
      return "mdi:album";
    case MediaClass.Artist:
      return "mdi:account-music";
    case MediaClass.Track:
      return "mdi:music-note";
    case MediaClass.Playlist:
      return "mdi:playlist-music";
    case MediaClass.Genre:
      return "mdi:music-box-multiple";
    case MediaClass.App:
      return "mdi:application";
    case MediaClass.Directory:
      return "mdi:folder";
    default:
      return "mdi:folder";
  }
};
