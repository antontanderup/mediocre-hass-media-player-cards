import { Input, MediaTrack } from "@components";
import { useCallback, useState } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import {
  FilterChip,
  FilterContainer,
  MediaEmptyState,
  MediaGrid,
  MediaItem,
  MediaSectionTitle,
  ResultsContainer,
  SearchContainer,
  TrackListContainer,
  VerticalChipSeparator,
} from "@components/MediaSearch";
import {
  MaMediaType,
  MaFilterType,
  MaFilterConfig,
  MaArtist,
  MaAlbum,
  MaTrack,
  MaPlaylist,
  MaRadio,
  MaPodcast,
  MaAudiobook,
  MaEnqueueMode,
} from "./types";
import { useSearchQuery } from "./useSearchQuery";
import { Fragment } from "preact";

const filters: MaFilterConfig[] = [
  { type: "all", label: "All", icon: "mdi:all-inclusive" },
  { type: "artist", label: "Artists", icon: "mdi:account-music" },
  { type: "album", label: "Albums", icon: "mdi:album" },
  { type: "track", label: "Tracks", icon: "mdi:music-note" },
  { type: "playlist", label: "Playlists", icon: "mdi:playlist-music" },
  { type: "radio", label: "Radio", icon: "mdi:radio" },
  { type: "audiobook", label: "Audiobooks", icon: "mdi:book" },
  { type: "podcast", label: "Podcasts", icon: "mdi:podcast" },
];

const responseKeyMediaTypeMap: { [key: string]: MaMediaType } = {
  artists: "artist",
  albums: "album",
  tracks: "track",
  playlists: "playlist",
  radio: "radio",
  audiobooks: "audiobook",
  podcasts: "podcast",
};

const labelMap: { [key in MaMediaType]: string } = {
  artist: "Artists",
  album: "Albums",
  track: "Tracks",
  playlist: "Playlists",
  radio: "Radio",
  audiobook: "Audiobooks",
  podcast: "Podcasts",
};

export type MaSearchProps = {
  maEntityId: string;
  horizontalPadding?: number;
  searchBarPosition?: "top" | "bottom";
};

export const MaSearch = ({
  maEntityId,
  horizontalPadding,
  searchBarPosition = "top",
}: MaSearchProps) => {
  const [query, setQuery] = useState("");
  const [enqueueMode, setEnqueueMode] = useState<MaEnqueueMode>("play");
  const debouncedQuery = useDebounce(query, 300);
  const [activeFilter, setActiveFilter] = useState<MaFilterType>("all");

  const toggleEnqueueMode = useCallback(() => {
    const enqueueModes: MaEnqueueMode[] = [
      "play",
      "replace",
      "next",
      "replace_next",
      "add",
    ];
    const currentIndex = enqueueModes.indexOf(enqueueMode);
    const nextIndex = (currentIndex + 1) % enqueueModes.length;
    setEnqueueMode(enqueueModes[nextIndex]);
  }, [enqueueMode]);

  const { results, loading, playItem } = useSearchQuery(
    debouncedQuery,
    activeFilter
  );

  const renderSearchBar = () => {
    return (
      <div css={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Input
          placeholder="Search.."
          onChange={setQuery}
          value={query}
          loading={loading}
          css={{ padding: "1px var(--mmpc-search-padding, 0px)" }}
        />
        <FilterContainer>
          <FilterChip
            $horizontalPadding={horizontalPadding}
            icon={getEnqueModeIcon(enqueueMode)}
            onClick={toggleEnqueueMode}
          >
            {getEnqueueModeLabel(enqueueMode)}
          </FilterChip>
          <VerticalChipSeparator />
          {renderFilterChips()}
        </FilterContainer>
      </div>
    );
  };

  const renderFilterChips = () => {
    return filters.map(filter => (
      <FilterChip
        key={filter.type}
        onClick={() => setActiveFilter(filter.type)}
        icon={filter.icon}
        style={{
          opacity: activeFilter === filter.type ? 1 : 0.6,
          fontWeight: activeFilter === filter.type ? "bold" : "normal",
        }}
        $horizontalPadding={horizontalPadding}
      >
        {filter.label}
      </FilterChip>
    ));
  };

  const renderResult = (
    result:
      | MaArtist[]
      | MaAlbum[]
      | MaTrack[]
      | MaPlaylist[]
      | MaRadio[]
      | MaAudiobook[]
      | MaPodcast[],
    mediaType: MaMediaType
  ) => {
    if (!result) return null;
    if (activeFilter !== "all" && activeFilter !== mediaType) return null;
    if (result.length === 0 && activeFilter === "all") return null;

    return (
      <Fragment key={mediaType}>
        {activeFilter === "all" && (
          <MediaSectionTitle onClick={() => setActiveFilter(mediaType)}>
            {labelMap[mediaType]}
          </MediaSectionTitle>
        )}
        {mediaType === "track" ? (
          <TrackListContainer>
            {(activeFilter === "all" ? result.slice(0, 5) : result).map(
              item => (
                <MediaTrack
                  key={item.uri}
                  imageUrl={item.image || item.album?.image}
                  title={item.name}
                  artist={item.artists.map(artist => artist.name).join(", ")}
                  onClick={() => playItem(item, maEntityId, enqueueMode)}
                />
              )
            )}
          </TrackListContainer>
        ) : (
          <MediaGrid>
            {(activeFilter === "all" ? result.slice(0, 6) : result).map(
              item => (
                <MediaItem
                  key={item.uri}
                  imageUrl={item.image}
                  name={item.name}
                  artist={item.artists?.map(artist => artist.name).join(", ")}
                  onClick={() => playItem(item, maEntityId, enqueueMode)}
                />
              )
            )}
          </MediaGrid>
        )}
        {result.length === 0 && (
          <MediaEmptyState>
            {loading ? "Searching..." : "No results found."}
          </MediaEmptyState>
        )}
      </Fragment>
    );
  };
  return (
    <SearchContainer
      $horizontalPadding={horizontalPadding}
      $searchBarPosition={searchBarPosition}
    >
      {searchBarPosition === "top" && renderSearchBar()}
      {results && (
        <ResultsContainer $searchBarPosition={searchBarPosition}>
          {Object.entries(results).map(([key, value]) => {
            return renderResult(value, responseKeyMediaTypeMap[key]);
          })}
        </ResultsContainer>
      )}
      {searchBarPosition === "bottom" && renderSearchBar()}
    </SearchContainer>
  );
};

const getEnqueModeIcon = (enqueueMode: MaEnqueueMode) => {
  switch (enqueueMode) {
    case "play": // Play now
      return "mdi:play-circle";
    case "replace": // Replace the existing queue and play now
      return "mdi:playlist-remove";
    case "next": // Add to the current queue after the currently playing item
      return "mdi:playlist-play";
    case "replace_next": // Replace the current queue after the currently playing item
      return "mdi:playlist-edit";
    case "add": // Add to the end of the queue
      return "mdi:playlist-plus";
    default:
      return "mdi:play-circle";
  }
};

const getEnqueueModeLabel = (enqueueMode: MaEnqueueMode) => {
  switch (enqueueMode) {
    case "play":
      return "Play now";
    case "replace":
      return "Replace queue";
    case "next":
      return "Add next";
    case "replace_next":
      return "Replace next";
    case "add":
      return "Add to queue";
    default:
      return "Play";
  }
};
