import { MediaItem } from "@components/MediaSearch/components/MediaItem";
import { MediaTrack } from "@components/MediaSearch/components/MediaTrack";
import { theme } from "@constants";
import { css } from "@emotion/react";
import {
  MaAlbum,
  MaFilterType,
  MaMediaItem,
  MaSearchResponse,
  MaTrack,
  MaViewMode,
} from "./types";
import { labelMap } from "./constants";

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: "0px var(--mmpc-search-padding, 0px) 12px",
  }),
  section: css({
    display: "flex",
    flexDirection: "column",
    gap: 10,
  }),
  sectionTitle: css({
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--primary-text-color)",
  }),
  grid: css({
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  }),
  compactGrid: css({
    display: "grid",
    gap: 10,
    gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
  }),
  list: css({
    display: "flex",
    flexDirection: "column",
    gap: 8,
  }),
  emptyText: css({
    color: "var(--secondary-text-color)",
    padding: "0px var(--mmpc-search-padding, 0px)",
  }),
  loadMoreButton: css({
    alignSelf: "center",
    border: "none",
    background: "rgba(255, 255, 255, 0.08)",
    color: "var(--primary-text-color)",
    padding: "10px 16px",
    borderRadius: `max(${theme.sizes.cardBorderRadius}, 12px)`,
    cursor: "pointer",
    fontWeight: 600,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.12)",
    },
  }),
};

type Section = {
  key: keyof MaSearchResponse;
  label: string;
  items: MaMediaItem[];
};

export type MaResultsViewProps = {
  results?: MaSearchResponse | null;
  activeFilter: MaFilterType;
  viewMode: MaViewMode;
  compactThumbColumns?: number;
  emptyText?: string;
  thumbColumns?: number;
  canLoadMore?: boolean;
  onLoadMore?: () => void;
  onItemClick: (item: MaMediaItem) => void | Promise<void>;
};

export const MaResultsView = ({
  results,
  activeFilter,
  viewMode,
  compactThumbColumns = 5,
  emptyText,
  thumbColumns = 4,
  canLoadMore = false,
  onLoadMore,
  onItemClick,
}: MaResultsViewProps) => {
  const sections = getSections(results, activeFilter);
  const hasItems = sections.some(section => section.items.length > 0);

  if (!hasItems) {
    return <div css={styles.emptyText}>{emptyText ?? "No results found."}</div>;
  }

  const showSectionTitles = activeFilter === "all" || activeFilter === "music";

  return (
    <div css={styles.root}>
      {sections.map(section => {
        if (!section.items.length) return null;

        return (
          <section key={section.key} css={styles.section}>
            {showSectionTitles && <div css={styles.sectionTitle}>{section.label}</div>}
            <div
              style={
                viewMode === "list"
                  ? undefined
                  : {
                      gridTemplateColumns: getGridTemplateColumns(
                        viewMode === "compact_thumbs"
                          ? compactThumbColumns
                          : thumbColumns
                      ),
                    }
              }
              css={
                viewMode === "list"
                  ? styles.list
                  : viewMode === "compact_thumbs"
                    ? styles.compactGrid
                    : styles.grid
              }
            >
              {section.items.map(item =>
                viewMode === "list" ? (
                  <MediaTrack
                    key={item.uri}
                    title={item.name}
                    artist={getItemSubtitle(item)}
                    imageUrl={getItemImage(item)}
                    onClick={() => onItemClick(item)}
                  />
                ) : (
                  <MediaItem
                    key={item.uri}
                    name={item.name}
                    artist={viewMode === "thumbs" ? getItemSubtitle(item) : undefined}
                    imageUrl={getItemImage(item)}
                    onClick={() => onItemClick(item)}
                  />
                )
              )}
            </div>
          </section>
        );
      })}
      {canLoadMore && !!onLoadMore && (
        <button type="button" css={styles.loadMoreButton} onClick={onLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

const getGridTemplateColumns = (columns?: number) =>
  `repeat(${getNormalizedColumns(columns)}, minmax(0, 1fr))`;

const getNormalizedColumns = (columns?: number) => {
  if (!Number.isFinite(columns)) return 4;
  return Math.max(1, Math.floor(columns!));
};

const sectionOrder: (keyof MaSearchResponse)[] = [
  "artists",
  "albums",
  "tracks",
  "playlists",
  "radio",
  "genres",
  "audiobooks",
  "podcasts",
];

const musicSectionOrder: (keyof MaSearchResponse)[] = [
  "artists",
  "albums",
  "tracks",
];

const getSections = (
  results: MaSearchResponse | null | undefined,
  filter: MaFilterType
): Section[] => {
  if (!results) return [];

  if (filter === "all") {
    return sectionOrder.map(key => ({
      key,
      items: results[key] ?? [],
      label: getSectionLabel(key),
    }));
  }

  if (filter === "music") {
    return musicSectionOrder.map(key => ({
      key,
      items: results[key] ?? [],
      label: getSectionLabel(key),
    }));
  }

  const sectionKey = getSectionKey(filter);
  return [
    {
      key: sectionKey,
      items: results[sectionKey] ?? [],
      label: getSectionLabel(sectionKey),
    },
  ];
};

const getSectionKey = (
  filter: Exclude<MaFilterType, "all" | "music">
): keyof MaSearchResponse => {
  switch (filter) {
    case "artist":
      return "artists";
    case "album":
      return "albums";
    case "track":
      return "tracks";
    case "playlist":
      return "playlists";
    case "radio":
      return "radio";
    case "genre":
      return "genres";
    case "audiobook":
      return "audiobooks";
    case "podcast":
      return "podcasts";
  }
};

const getSectionLabel = (key: keyof MaSearchResponse) => {
  switch (key) {
    case "artists":
      return labelMap.artist;
    case "albums":
      return labelMap.album;
    case "tracks":
      return labelMap.track;
    case "playlists":
      return labelMap.playlist;
    case "radio":
      return labelMap.radio;
    case "genres":
      return labelMap.genre;
    case "audiobooks":
      return labelMap.audiobook;
    case "podcasts":
      return labelMap.podcast;
  }
};

const getItemSubtitle = (item: MaMediaItem) => {
  if ("artists" in item && Array.isArray(item.artists) && item.artists.length > 0) {
    return item.artists.map(artist => artist.name).join(", ");
  }
  return undefined;
};

const getItemImage = (item: MaMediaItem) => {
  if (item.media_type === "track") {
    return (item as MaTrack).image ?? (item as MaTrack).album?.image;
  }
  if (item.media_type === "album") {
    return (item as MaAlbum).image;
  }
  return item.image;
};
