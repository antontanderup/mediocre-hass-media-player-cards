import { Spinner } from "@components/Spinner";
import {
  MaAlbum,
  MaMediaItem,
  MaMediaType,
  MaSearchResponse,
  MaTrack,
} from "./types";
import {
  searchStyles,
  MediaItem,
  MediaSectionTitle,
} from "@components/MediaSearch";
import { VirtualList, VirtualListProps } from "@components/VirtualList";
import { MediaTrack } from "@components";
import { useMemo } from "preact/hooks";
import { labelMap, responseKeyMediaTypeMap } from "./constants";

export type MaMediaItemsListProps = Omit<
  VirtualListProps<MaMediaListItem>,
  "renderItem" | "data"
> & {
  onItemClick: (item: MaMediaItem) => void | Promise<void>;
  onHeaderClick?: (mediaType: MaMediaType) => void;
  loading?: boolean;
  error?: string | null;
  results?: MaSearchResponse;
};

type MaMediaListItem =
  | {
      type: "header";
      mediaType: MaMediaType; // placed between items of different media_types
    }
  | {
      type: "item"; // if item has media_class: track
      item: MaMediaItem;
    }
  | {
      type: "itemsRow"; // if item has other media_class should be in chunks of 4 items
      items: MaMediaItem[];
    };

export const MaMediaItemsList = ({
  onItemClick,
  onHeaderClick,
  loading = false,
  error = null,
  results,
  ...listProps
}: MaMediaItemsListProps) => {
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p css={searchStyles.mediaEmptyText}>{error}</p>;
  }

  const data: MaMediaListItem[] = useMemo(() => {
    const newItems: MaMediaListItem[] = [];
    if (!results) return newItems;

    const groupedResults: { mediaType: MaMediaType; items: MaMediaItem[] }[] =
      Object.entries(results)
        .map(([mediaType, mediaItems]) => ({
          mediaType: responseKeyMediaTypeMap[mediaType],
          items: mediaItems,
        }))
        .filter(groupedResult => groupedResult.items.length > 0);

    groupedResults.forEach(({ mediaType, items: mediaItems }) => {
      if (mediaItems.length === 0) return;

      // Add header for the media type
      if (groupedResults.length > 1) {
        newItems.push({
          type: "header",
          mediaType,
        });
      }

      // If media class is track, add as individual items
      if (mediaItems[0].media_type === "track") {
        mediaItems.forEach((item: MaMediaItem) => {
          newItems.push({
            type: "item",
            item,
          });
        });
      } else {
        // Other media types are grouped in rows of 4
        for (let i = 0; i < mediaItems.length; i += 4) {
          const chunk = mediaItems.slice(i, i + 4);
          newItems.push({
            type: "itemsRow",
            items: chunk,
          });
        }
      }
    });
    return newItems;
  }, [results]);

  const renderItem = (item: MaMediaListItem) => {
    switch (item.type) {
      case "header": {
        return (
          <MediaSectionTitle onClick={() => onHeaderClick?.(item.mediaType)}>
            {labelMap[item.mediaType]}
          </MediaSectionTitle>
        );
      }

      case "item": {
        const { item: mediaItem } = item;
        const handleClick = async () => {
          await onItemClick(mediaItem);
        };
        return (
          <div css={searchStyles.mediaGrid}>
            {mediaItem.media_type === "track" ? (
              <MediaTrack
                key={mediaItem.uri}
                imageUrl={
                  (mediaItem as MaTrack).image ??
                  (mediaItem as MaTrack).album?.image
                }
                title={mediaItem.name}
                artist={(mediaItem as MaTrack).artists
                  .map(artist => artist.name)
                  .join(", ")}
                onClick={handleClick}
              />
            ) : (
              <MediaItem
                key={mediaItem.uri}
                imageUrl={mediaItem.image}
                name={mediaItem.name}
                artist={
                  "artists" in mediaItem
                    ? (mediaItem as MaAlbum).artists
                        .map(artist => artist.name)
                        .join(", ")
                    : undefined
                }
                onClick={handleClick}
              />
            )}
          </div>
        );
      }

      case "itemsRow":
        return (
          <div css={searchStyles.mediaGrid}>
            {item.items.map(mediaItem => {
              const handleClick = async () => {
                await onItemClick(mediaItem);
              };

              return mediaItem.media_type === "track" ? (
                <MediaTrack
                  key={mediaItem.uri}
                  imageUrl={
                    (mediaItem as MaTrack).image ??
                    (mediaItem as MaTrack).album?.image
                  }
                  title={mediaItem.name}
                  artist={(mediaItem as MaTrack).artists
                    .map(artist => artist.name)
                    .join(", ")}
                  onClick={handleClick}
                />
              ) : (
                <MediaItem
                  key={mediaItem.uri}
                  imageUrl={mediaItem.image}
                  name={mediaItem.name}
                  artist={
                    "artists" in mediaItem
                      ? (mediaItem as MaAlbum).artists
                          .map(artist => artist.name)
                          .join(", ")
                      : undefined
                  }
                  onClick={handleClick}
                />
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <VirtualList
      data={data}
      renderItem={renderItem}
      renderEmpty={() => (
        <p css={searchStyles.mediaEmptyText}>No items found.</p>
      )}
      {...listProps}
    />
  );
};
