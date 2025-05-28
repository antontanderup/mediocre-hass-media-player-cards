import { Chip, Input, MediaTrack } from "@components";
import { useCallback, useState } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import {
  MediaItem,
  MediaSectionTitle,
  searchStyles,
} from "@components/MediaSearch";
import {
  HaFilterConfig,
  HaEnqueueMode,
  HaFilterType,
  HaFilterResult,
} from "./types";
import { useSearchQuery } from "./useSearchQuery";
import { Fragment } from "preact";
import { useMediaBrowserFavorites } from "./useMediaBrowserFavorites";

const filters: HaFilterConfig[] = [
  { type: "all", label: "All", icon: "mdi:all-inclusive" },
  { type: "artists", label: "Artists", icon: "mdi:account-music" },
  { type: "albums", label: "Albums", icon: "mdi:album" },
  { type: "tracks", label: "Tracks", icon: "mdi:music-note" },
  { type: "playlists", label: "Playlists", icon: "mdi:playlist-music" },
];

export type HaSearchProps = {
  entityId: string;
  showFavorites: boolean;
  horizontalPadding?: number;
  searchBarPosition?: "top" | "bottom";
};

export const HaSearch = ({
  entityId,
  showFavorites,
  horizontalPadding,
  searchBarPosition = "top",
}: HaSearchProps) => {
  const [query, setQuery] = useState("");
  const [enqueueMode, setEnqueueMode] = useState<HaEnqueueMode>("play");
  const debouncedQuery = useDebounce(query, 600);
  const [activeFilter, setActiveFilter] = useState<HaFilterType>("all");

  const toggleEnqueueMode = useCallback(() => {
    const enqueueModes: HaEnqueueMode[] = ["play", "replace", "next", "add"];
    const currentIndex = enqueueModes.indexOf(enqueueMode);
    const nextIndex = (currentIndex + 1) % enqueueModes.length;
    setEnqueueMode(enqueueModes[nextIndex]);
  }, [enqueueMode]);

  const { results, loading, error, playItem } = useSearchQuery(
    debouncedQuery,
    activeFilter,
    entityId
  );

  const { favorites } = useMediaBrowserFavorites(
    entityId,
    query === "" && showFavorites
  );

  const renderSearchBar = () => {
    return (
      <div css={searchStyles.searchBarContainer}>
        <Input
          placeholder="Search.."
          onChange={setQuery}
          value={query}
          loading={loading}
          css={searchStyles.searchInput}
        />
        <div css={searchStyles.filterContainer}>
          <Chip
            css={searchStyles.chip}
            style={{
              "--mmpc-chip-horizontal-margin": `${horizontalPadding}px`,
            }}
            icon={getEnqueModeIcon(enqueueMode)}
            onClick={toggleEnqueueMode}
          >
            {getEnqueueModeLabel(enqueueMode)}
          </Chip>
          <div css={searchStyles.verticalChipSeperator} />
          {renderFilterChips()}
        </div>
      </div>
    );
  };

  const renderFilterChips = () => {
    return filters.map(filter => (
      <Chip
        css={searchStyles.chip}
        style={{
          "--mmpc-chip-horizontal-margin": `${horizontalPadding}px`,
          opacity: activeFilter === filter.type ? 1 : 0.6,
          fontWeight: activeFilter === filter.type ? "bold" : "normal",
        }}
        key={filter.type}
        onClick={() => setActiveFilter(filter.type)}
        icon={filter.icon}
      >
        {filter.label}
      </Chip>
    ));
  };

  const renderResult = (result: HaFilterResult[number], isLoading: boolean) => {
    if (!result) return null;
    const { type: mediaType, label, results } = result;
    if (activeFilter !== "all" && activeFilter !== mediaType) return null;
    if (results.length === 0 && activeFilter === "all") return null;

    return (
      <Fragment key={mediaType}>
        {activeFilter === "all" && (
          <MediaSectionTitle onClick={() => setActiveFilter(mediaType)}>
            {label}
          </MediaSectionTitle>
        )}
        {mediaType === "tracks" ? (
          <div css={searchStyles.trackListContainer}>
            {(activeFilter === "all" ? results.slice(0, 5) : results).map(
              item => (
                <MediaTrack
                  key={item.media_content_id}
                  imageUrl={item.thumbnail}
                  title={item.title}
                  onClick={() => playItem(item, entityId, enqueueMode)}
                />
              )
            )}
          </div>
        ) : (
          <div css={searchStyles.mediaGrid}>
            {(activeFilter === "all" ? results.slice(0, 6) : results).map(
              item => (
                <MediaItem
                  key={item.media_content_id}
                  imageUrl={item.thumbnail}
                  name={item.title}
                  onClick={() => playItem(item, entityId, enqueueMode)}
                />
              )
            )}
          </div>
        )}
        {results.length === 0 && (
          <p css={searchStyles.mediaEmptyText}>
            {isLoading ? "Searching..." : "No results found."}
          </p>
        )}
      </Fragment>
    );
  };

  return (
    <div
      css={[
        searchStyles.root,
        searchBarPosition === "bottom" && searchStyles.rootSearchBarBottom,
      ]}
      style={{
        "--mmpc-search-padding": `${horizontalPadding}px`,
      }}
    >
      {searchBarPosition === "top" && renderSearchBar()}
      {results && query !== "" && (
        <div
          css={
            searchBarPosition === "bottom"
              ? searchStyles.resultsContainerSearchBarBottom
              : {}
          }
        >
          {results.map(item => renderResult(item, loading))}
        </div>
      )}
      {query === "" && favorites.length > 0 && (
        <Fragment>
          <div css={searchStyles.mediaGrid}>
            {favorites.map(item => (
              <MediaItem
                key={item.media_content_id + item.title}
                imageUrl={item.thumbnail}
                name={item.title}
                onClick={() => playItem(item, entityId, enqueueMode)}
              />
            ))}
          </div>
        </Fragment>
      )}
      {error && (
        <div
          css={
            searchBarPosition === "bottom"
              ? searchStyles.resultsContainerSearchBarBottom
              : {}
          }
        >
          <p css={searchStyles.mediaEmptyText}>{error}</p>
        </div>
      )}
      {searchBarPosition === "bottom" && renderSearchBar()}
    </div>
  );
};

const getEnqueModeIcon = (enqueueMode: HaEnqueueMode) => {
  switch (enqueueMode) {
    case "play": // Play now
      return "mdi:play-circle";
    case "replace": // Replace the existing queue and play now
      return "mdi:playlist-remove";
    case "next": // Add to the current queue after the currently playing item
      return "mdi:playlist-play";
    case "add": // Add to the end of the queue
      return "mdi:playlist-plus";
    default:
      return "mdi:play-circle";
  }
};

const getEnqueueModeLabel = (enqueueMode: HaEnqueueMode) => {
  switch (enqueueMode) {
    case "play":
      return "Play now";
    case "replace":
      return "Replace queue";
    case "next":
      return "Add next";
    case "add":
      return "Add to queue";
    default:
      return "Play";
  }
};
