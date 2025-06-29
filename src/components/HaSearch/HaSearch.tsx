import { Chip, Input } from "@components";
import { useCallback, useState } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import { searchStyles } from "@components/MediaSearch";
import { HaFilterConfig, HaEnqueueMode, HaFilterType } from "./types";
import { useSearchQuery } from "./useSearchQuery";
import { useMediaBrowser } from "./useMediaBrowser";
import { HaMediaItemsList } from "./HaMediaItemsList";

const filters: HaFilterConfig[] = [
  { media_type: "artists", name: "Artists", icon: "mdi:account-music" },
  { media_type: "albums", name: "Albums", icon: "mdi:album" },
  { media_type: "tracks", name: "Tracks", icon: "mdi:music-note" },
  { media_type: "playlists", name: "Playlists", icon: "mdi:playlist-music" },
];

export type HaSearchProps = {
  entityId: string;
  showFavorites: boolean;
  horizontalPadding?: number;
  filterConfig?: HaFilterConfig[];
  searchBarPosition?: "top" | "bottom";
  maxHeight?: number;
};

export const HaSearch = ({
  entityId,
  showFavorites,
  horizontalPadding,
  searchBarPosition = "top",
  maxHeight = 300,
  filterConfig = filters,
}: HaSearchProps) => {
  const [query, setQuery] = useState("");
  const [enqueueMode, setEnqueueMode] = useState<HaEnqueueMode>("replace");
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

  const { mediaBrowserItems } = useMediaBrowser(
    entityId,
    activeFilter === "all" ? "favorites" : activeFilter,
    ((activeFilter === "all" && showFavorites) || activeFilter !== "all") &&
      query === ""
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
    return [
      { media_type: "all", name: "All", icon: "mdi:all-inclusive" },
      ...filterConfig,
    ].map(filter => (
      <Chip
        css={searchStyles.chip}
        style={{
          "--mmpc-chip-horizontal-margin": `${horizontalPadding}px`,
          opacity: activeFilter === filter.media_type ? 1 : 0.6,
          fontWeight: activeFilter === filter.media_type ? "bold" : "normal",
        }}
        key={filter.media_type}
        onClick={() => setActiveFilter(filter.media_type)}
        icon={filter.icon}
      >
        {filter.name}
      </Chip>
    ));
  };

  return (
    <div
      css={searchStyles.root}
      style={{
        "--mmpc-search-padding": `${horizontalPadding}px`,
      }}
    >
      <HaMediaItemsList
        renderHeader={searchBarPosition === "top" ? renderSearchBar : undefined}
        data={
          query === "" && mediaBrowserItems.length > 0
            ? mediaBrowserItems
            : results
        }
        error={error}
        hideEmpty={query === "" && activeFilter === "all" && !showFavorites}
        onItemClick={item => playItem(item, entityId, enqueueMode)}
        style={{
          "--mmpc-search-padding": `${horizontalPadding}px`,
        }}
        maxHeight={maxHeight}
        filterConfig={filterConfig}
        onHeaderClick={setActiveFilter}
      />
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
