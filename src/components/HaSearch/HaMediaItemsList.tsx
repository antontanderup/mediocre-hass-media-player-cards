import { Spinner } from "@components/Spinner";
import { HaFilterConfig, HaMediaItem } from "./types";
import {
  searchStyles,
  MediaItem,
  MediaSectionTitle,
  MediaGrid,
} from "@components/MediaSearch";
import { VirtualList, VirtualListProps } from "@components/VirtualList";
import { getItemMdiIcon, MediaTrack } from "@components";
import { useMemo, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useIntl } from "@components/i18n";

export type HaMediaItemsListProps = Omit<
  VirtualListProps<HaMediaListItem>,
  "renderItem" | "data"
> & {
  data: HaMediaItem[];
  onItemClick: (item: HaMediaItem) => void | Promise<void>;
  onHeaderClick?: (mediaType: string) => void;
  filterConfig: HaFilterConfig[];
  loading?: boolean;
  hideEmpty: boolean;
  error?: string | null;
};

type HaMediaListItem =
  | {
      type: "header";
      mediaType: string; // placed between items of different media_types
    }
  | {
      type: "item"; // if item has media_class: track
      item: HaMediaItem;
    }
  | {
      type: "itemsRow"; // if item has other media_class should be in chunks of 4 items
      items: HaMediaItem[];
    };

export const HaMediaItemsList = ({
  data,
  onItemClick,
  onHeaderClick,
  filterConfig,
  loading = false,
  hideEmpty = false,
  error = null,
  ...listProps
}: HaMediaItemsListProps) => {
  const { t } = useIntl();
  const [chunkSize, setChunkSize] = useState(4);

  const {
    items,
    hasNoArtwork,
  }: { items: HaMediaListItem[]; hasNoArtwork: boolean } = useMemo(() => {
    let hasNoArtwork = true;
    const result: HaMediaListItem[] = [];
    const groupedByType: Record<string, HaMediaItem[]> = {};

    // Group items by media_content_type
    data.forEach(item => {
      const type = item.media_content_type;
      if (typeof item.thumbnail === "string") {
        hasNoArtwork = false;
      }
      if (!groupedByType[type]) {
        groupedByType[type] = [];
      }
      groupedByType[type].push(item);
    });

    // Process each group
    Object.entries(groupedByType).forEach(([mediaType, items]) => {
      // Add header for each media type unless there is only one group
      if (Object.keys(groupedByType).length > 1) {
        result.push({
          type: "header",
          mediaType,
        });
      }

      // Add items based on media_class
      if (
        items[0]?.media_class === "track" &&
        items[0]?.media_content_type !== "favorite"
      ) {
        // Tracks are added individually
        items.forEach(item => {
          result.push({
            type: "item",
            item,
          });
        });
      } else {
        // Other media types are grouped in rows of 4
        for (let i = 0; i < items.length; i += chunkSize) {
          const chunk = items.slice(i, i + chunkSize);
          result.push({
            type: "itemsRow",
            items: chunk,
          });
        }
      }
    });

    return { items: result, hasNoArtwork };
  }, [data, chunkSize]);

  const renderItem = (item: HaMediaListItem) => {
    switch (item.type) {
      case "header": {
        const filterConfigItem = filterConfig.find(
          config =>
            config.media_type === item.mediaType ||
            config.media_type.slice(0, -1) === item.mediaType
        );
        const name =
          filterConfigItem?.name ??
          item.mediaType.charAt(0).toUpperCase() + item.mediaType.slice(1);
        return (
          <MediaSectionTitle
            onClick={
              filterConfigItem
                ? () => onHeaderClick?.(filterConfigItem.media_type)
                : undefined
            }
          >
            {t({
              id: `Search.categories.${name}`,
              defaultMessage: name,
            })}
          </MediaSectionTitle>
        );
      }

      case "item": {
        const { item: mediaItem } = item;
        const handleClick = async () => {
          await onItemClick(mediaItem);
        };
        return (
          <MediaGrid numberOfColumns={chunkSize}>
            {(mediaItem.media_class === "track" &&
              mediaItem.media_content_type !== "favorite") ||
            hasNoArtwork ? (
              <MediaTrack
                key={mediaItem.media_content_id}
                imageUrl={mediaItem.thumbnail}
                title={mediaItem.title}
                mdiIcon={getItemMdiIcon(mediaItem)}
                onClick={handleClick}
              />
            ) : (
              <MediaItem
                key={mediaItem.media_content_id}
                imageUrl={mediaItem.thumbnail}
                name={mediaItem.title}
                mdiIcon={getItemMdiIcon(mediaItem)}
                onClick={handleClick}
              />
            )}
          </MediaGrid>
        );
      }

      case "itemsRow":
        return (
          <MediaGrid numberOfColumns={chunkSize}>
            {item.items.map(mediaItem => {
              const handleClick = async () => {
                await onItemClick(mediaItem);
              };

              return (mediaItem.media_class === "track" &&
                mediaItem.media_content_type !== "favorite") ||
                hasNoArtwork ? (
                <MediaTrack
                  key={mediaItem.media_content_id}
                  imageUrl={mediaItem.thumbnail}
                  title={mediaItem.title}
                  mdiIcon={getItemMdiIcon(mediaItem)}
                  onClick={handleClick}
                />
              ) : (
                <MediaItem
                  key={mediaItem.media_content_id}
                  imageUrl={mediaItem.thumbnail}
                  name={mediaItem.title}
                  mdiIcon={getItemMdiIcon(mediaItem)}
                  onClick={handleClick}
                />
              );
            })}
          </MediaGrid>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <VirtualList
      onLayout={({ width }) => {
        if (width > 800) {
          setChunkSize(6);
        } else if (width > 390) {
          setChunkSize(4);
        } else {
          setChunkSize(3);
        }
      }}
      data={items}
      renderItem={renderItem}
      renderEmpty={() => (
        <Fragment>
          {error ? (
            <p css={searchStyles.mediaEmptyText}>{error}</p>
          ) : !hideEmpty ? (
            <p css={searchStyles.mediaEmptyText}>
              {t({
                id: "Search.no_results",
                defaultMessage: "No results found.",
              })}
            </p>
          ) : null}
        </Fragment>
      )}
      {...listProps}
    />
  );
};
