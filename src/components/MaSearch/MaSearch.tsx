import { Input, MediaTrack } from "@components";
import { getHass } from "@utils";
import { useCallback, useState } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import {
  FilterChip,
  FilterContainer,
  MediaGrid,
  MediaItem,
  MediaSectionTitle,
  SearchContainer,
  TrackListContainer,
} from "@components/MediaSearch";
import {
  MaMediaType,
  MaFilterType,
  MaFilterConfig,
  MaMediaItem,
  MaArtist,
  MaAlbum,
  MaTrack,
  MaPlaylist,
  MaRadio,
  MaPodcast,
  MaAudiobook,
  responseKeyMediaTypeMap,
  labelMap,
} from "./types";
import { useSearchQuery } from "./useSearchQuery";

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

export type MaSearchProps = {
  maEntityId: string;
  horizontalPadding?: number;
};

export const MaSearch = ({ maEntityId, horizontalPadding }: MaSearchProps) => {
  const [query, setQuery] = useState("");
  const debuncedQuery = useDebounce(query, 300);

  const [activeFilter, setActiveFilter] = useState<MaFilterType>("all");

  const { results, loading } = useSearchQuery(debuncedQuery, activeFilter);

  const playItem = useCallback(async (item: MaMediaItem) => {
    const hass = getHass();
    return hass.callService("music_assistant", "play_media", {
      entity_id: maEntityId,
      media_type: item.media_type,
      media_id: item.uri,
    });
  }, []);

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
      <div key={mediaType}>
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
                  onClick={() => playItem(item)}
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
                  onClick={() => playItem(item)}
                />
              )
            )}
          </MediaGrid>
        )}
        {result.length == 0 && (
          <p>{loading ? "Searching..." : "No results found."}</p>
        )}
      </div>
    );
  };
  return (
    <SearchContainer $horizontalPadding={horizontalPadding}>
      <Input
        placeholder="Search.."
        onChange={setQuery}
        value={query}
        loading={loading}
        css={{ padding: "0px var(--mmpc-search-padding, 0px)" }}
      />
      <FilterContainer>{renderFilterChips()}</FilterContainer>
      {results &&
        Object.entries(results).map(([key, value]) => {
          return renderResult(value, responseKeyMediaTypeMap[key]);
        })}
    </SearchContainer>
  );
};
