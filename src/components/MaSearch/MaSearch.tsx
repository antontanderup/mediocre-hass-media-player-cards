import { Chip, Input, MediaTrack } from "@components";
import { useCallback, useState } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import {
  MediaItem,
  MediaSectionTitle,
  searchStyles,
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
          <div css={searchStyles.trackListContainer}>
            {(activeFilter === "all" ? result.slice(0, 5) : result).map(
              item => (
                <MediaTrack
                  key={item.uri}
                  imageUrl={
                    (item as MaTrack).image ?? (item as MaTrack).album?.image
                  }
                  title={item.name}
                  artist={(item as MaTrack).artists
                    .map(artist => artist.name)
                    .join(", ")}
                  onClick={() => playItem(item, maEntityId, enqueueMode)}
                />
              )
            )}
          </div>
        ) : (
          <div css={searchStyles.mediaGrid}>
            {(activeFilter === "all" ? result.slice(0, 6) : result).map(
              item => (
                <MediaItem
                  key={item.uri}
                  imageUrl={item.image}
                  name={item.name}
                  artist={
                    "artists" in item
                      ? item.artists.map(artist => artist.name).join(", ")
                      : undefined
                  }
                  onClick={() => playItem(item, maEntityId, enqueueMode)}
                />
              )
            )}
          </div>
        )}
        {result.length === 0 && (
          <p css={searchStyles.mediaEmptyText}>
            {loading ? "Searching..." : "No results found."}
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
      {results && (
        <div
          css={
            searchBarPosition === "bottom"
              ? searchStyles.resultsContainerSearchBarBottom
              : {}
          }
        >
          {Object.entries(results).map(([key, value]) => {
            return renderResult(value, responseKeyMediaTypeMap[key]);
          })}
        </div>
      )}
      {searchBarPosition === "bottom" && renderSearchBar()}
    </div>
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
