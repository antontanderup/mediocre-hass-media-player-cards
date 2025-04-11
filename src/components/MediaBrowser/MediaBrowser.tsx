import { Icon } from "@components";
import { IconButton } from "@components/IconButton";
import styled from "@emotion/styled";
import { getHass } from "@utils";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";

export type MediaBrowserProps = {
  entity_id: string;
};

// Media content type enum based on the provided data
export enum MediaContentType {
  Favorites = "Favorites",
  Artists = "Artists",
  Albums = "Albums",
  Tracks = "Tracks",
  Playlists = "Playlists",
  Genres = "Genres",
  NewMusic = "New Music",
  AlbumArtists = "Album Artists",
  Apps = "Apps",
  Radios = "Radios",
  App = "app",
}

// Media class enum
export enum MediaClass {
  Track = "track",
  Artist = "artist",
  Album = "album",
  Playlist = "playlist",
  Genre = "genre",
  App = "app",
}

const BrowserContainer = styled.div`
  max-height: 50vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  padding: 10px;
  padding-top: 16px;
`;

// Breadcrumb navigation components
const NavigationBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  color: var(--primary-text-color, #fff);
  border-bottom: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
`;

const Breadcrumbs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  overflow-x: auto;
  max-width: calc(100% - 40px);
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BreadcrumbItem = styled.button`
  background: none;
  border: none;
  color: var(--primary-text-color, #fff);
  cursor: pointer;
  padding: 2px 4px;
  white-space: nowrap;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: var(--secondary-text-color);
`;

const MediaFolder = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  align-items: center;
  background-color: var(--card-background-color);
`;

const MediaFolderTitle = styled.span`
  text-align: center;
  font-size: 0.9rem;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  cursor: pointer;
`;

const MediaFolderIconWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: var(--divider-color, rgba(0, 0, 0, 0.12));
  overflow: hidden;
`;

const Thumbnail = styled.img<{ $mediaClass?: MediaItem["media_class"] }>`
  width: 100%;
  ${props => props.$mediaClass === "app" && "width: 60%;"}
`;

const ItemButtons = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

export type MediaItem = {
  title: string;
  media_class: MediaClass | string;
  media_content_type: MediaContentType | string;
  media_content_id: string;
  children_media_class: MediaClass | null;
  can_play: boolean;
  can_expand: boolean;
  thumbnail: string | null;
};

export const MediaBrowser = ({ entity_id }: MediaBrowserProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [history, setHistory] = useState<
    { media_content_id: string; media_content_type: string; title: string }[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchMediaItems = async () => {
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
        })) as { children?: MediaItem[] };

        if (response && response.children) {
          setMediaItems(response.children);
          console.log("Media items:", response.children);
        } else {
          setMediaItems([]);
        }
      } catch (error) {
        console.error("Error fetching media items:", error);
      }
      setIsFetching(false);
    };

    fetchMediaItems();
  }, [entity_id, history]);

  const playItem = useCallback(
    (item: MediaItem) => {
      try {
        getHass().callService("media_player", "play_media", {
          entity_id,
          media_content_type: item.media_content_type,
          media_content_id: item.media_content_id,
        });
        console.log("Playing media item:", item);
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

  const onMediaItemClick = useCallback(
    (item: MediaItem) => {
      if (isFetching) return;
      if (
        item.can_expand &&
        item.media_content_id !== history[history.length - 1]?.media_content_id
      ) {
        setHistory(prev => [
          ...prev,
          {
            media_content_id: item.media_content_id,
            media_content_type: item.media_content_type,
            title: item.title,
          },
        ]);
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

  return (
    <div>
      {history.length > 0 && (
        <NavigationBar>
          <IconButton
            icon="mdi:arrow-left"
            size="x-small"
            onClick={goBack}
            disabled={history.length === 0}
          />
          <Breadcrumbs>
            <BreadcrumbItem onClick={() => setHistory([])}>Home</BreadcrumbItem>
            {history.map((item, index) => (
              <Fragment key={`breadcrumb-${index}-${item.title}`}>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem
                  key={`breadcrumb-${index}`}
                  onClick={() => goToIndex(index)}
                >
                  {item.title}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </Breadcrumbs>
        </NavigationBar>
      )}
      <BrowserContainer>
        {isFetching && <div>Loading...</div>}
        {!isFetching && mediaItems.length === 0 && (
          <div>No media items available</div>
        )}
        {mediaItems.map(item => (
          <MediaFolder
            onClick={() => onMediaItemClick(item)}
            key={item.media_content_id + history.length}
          >
            <MediaFolderIconWrap>
              {item.thumbnail ? (
                <Thumbnail
                  src={item.thumbnail}
                  alt={item.title}
                  $mediaClass={item.media_class}
                />
              ) : (
                <Icon size="medium" icon={getItemMdiIcon(item)} />
              )}
              <ItemButtons>
                {item.can_expand === true &&
                  item.media_content_id !==
                    history[history.length - 1]?.media_content_id && (
                    <IconButton
                      icon="mdi:folder"
                      size="x-small"
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        onMediaItemClick(item);
                      }}
                    />
                  )}
                {item.can_play === true && (
                  <IconButton
                    icon="mdi:play"
                    size="x-small"
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      playItem(item);
                    }}
                  />
                )}
              </ItemButtons>
            </MediaFolderIconWrap>
            <MediaFolderTitle onClick={() => onMediaItemClick(item)}>
              {item.title}
            </MediaFolderTitle>
          </MediaFolder>
        ))}
      </BrowserContainer>
    </div>
  );
};

const getItemMdiIcon = (item: MediaItem) => {
  if (item.thumbnail) return null;

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
    default:
      return "mdi:folder-music";
  }
};
