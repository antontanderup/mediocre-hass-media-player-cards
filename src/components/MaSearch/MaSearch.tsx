import { Input } from "@components";
import { getHass } from "@utils";
import { useCallback, useEffect, useState } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import styled from "@emotion/styled";
import { Chip } from "../Chip/Chip";

// Media types
export type MediaType =
  | "artist"
  | "album"
  | "track"
  | "playlist"
  | "radio"
  | "audiobook"
  | "podcast";

// Filter types (includes "all" in addition to MediaType)
export type FilterType = "all" | MediaType;

// Base media item interface
export interface MediaItem {
  media_type: MediaType;
  uri: string;
  name: string;
  version: string;
  image: string | null;
}

// Artist interface
export interface Artist extends MediaItem {
  media_type: "artist";
}

// Album interface
export interface Album extends MediaItem {
  media_type: "album";
  artists: Artist[];
}

// Track interface
export interface Track extends MediaItem {
  media_type: "track";
  artists: Artist[];
  album: Album;
}

// Playlist interface
export interface Playlist extends MediaItem {
  media_type: "playlist";
}

// Search response interface
export interface SearchResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  playlists: Playlist[];
  radio: any[]; // These are empty in the example but included for completeness
  audiobooks: any[];
  podcasts: any[];
}

// Styled components for media items
const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: thin;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    height: 0px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--secondary-text-color, rgba(255, 255, 255, 0.3));
    border-radius: 0px;
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: var(--primary-text-color);
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 16px;
`;

const MediaItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 8px;
  padding: 8px;
  background: var(--chip-background-color, rgba(255, 255, 255, 0.05));

  &:hover {
    transform: translateY(-4px);
  }
`;

const MediaImage = styled.div<{ imageUrl?: string | null }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  background-image: ${props =>
    props.imageUrl
      ? `url(${props.imageUrl})`
      : `linear-gradient(to bottom right, var(--disabled-text-color, #555), var(--primary-background-color, #333))`};
  margin-bottom: 8px;
`;

const MediaName = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
  color: var(--primary-text-color);
`;

const MediaArtist = styled.div`
  font-size: 12px;
  color: var(--secondary-text-color);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
`;

const TrackListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TrackItem = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--card-background-color, rgba(255, 255, 255, 0.05));
  cursor: pointer;

  &:hover {
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.1));
  }
`;

const TrackImage = styled.div<{ imageUrl?: string | null }>`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  background-image: ${props =>
    props.imageUrl
      ? `url(${props.imageUrl})`
      : `linear-gradient(to bottom right, var(--disabled-text-color, #555), var(--primary-background-color, #333))`};
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TrackName = styled.div`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary-text-color);
`;

const TrackArtist = styled.div`
  font-size: 12px;
  color: var(--secondary-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MaSearch = ({ maEntityId }: { maEntityId: string }) => {
  const [query, setQuery] = useState("");
  const debuncedQuery = useDebounce(query, 300);
  const [configEntry, setConfigEntry] = useState(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  console.log("🚀 ~ Search ~ configEntry:", configEntry);

  useEffect(() => {
    const hass = getHass();
    hass.callApi("GET", "config/config_entries/entry").then(entries => {
      const entry = entries.find(entry => {
        return entry.domain === "music_assistant";
      });
      console.log("🚀 ~ hass.callApi ~ entry:", entry);
      if (entry) {
        setConfigEntry(entry.entry_id);
      }
    });
  }, []);

  const [results, setResults] = useState<SearchResponse | null>(null);

  useEffect(() => {
    if (debuncedQuery === "") return;
    const message = {
      type: "call_service",
      domain: "music_assistant",
      service: "search",
      service_data: {
        name: debuncedQuery,
        config_entry_id: configEntry,
        limit: 50,
      },
      return_response: true,
    };

    const hass = getHass();
    hass.connection.sendMessagePromise(message).then(response => {
      console.log("Response:", response.response);
      setResults(response.response);
      return response;
    });
  }, [debuncedQuery, configEntry]);

  const playItem = useCallback(async (item: MediaItem) => {
    const hass = getHass();
    return hass.callService("music_assistant", "play_media", {
      entity_id: maEntityId,
      media_type: item.media_type,
      media_id: item.uri,
    });
  }, []);

  const renderArtists = (artists: Artist[]) => {
    if (!artists || artists.length === 0) return null;
    if (activeFilter !== "all" && activeFilter !== "artist") return null;

    return (
      <div>
        {activeFilter === "all" && <SectionTitle>Artists</SectionTitle>}
        <MediaGrid>
          {artists.slice(0, 6).map(artist => (
            <MediaItemContainer
              key={artist.uri}
              onClick={() => playItem(artist)}
            >
              <MediaImage imageUrl={artist.image} />
              <MediaName>{artist.name}</MediaName>
            </MediaItemContainer>
          ))}
        </MediaGrid>
      </div>
    );
  };

  const renderAlbums = (albums: Album[]) => {
    if (!albums || albums.length === 0) return null;
    if (activeFilter !== "all" && activeFilter !== "album") return null;

    return (
      <div>
        {activeFilter === "all" && <SectionTitle>Albums</SectionTitle>}
        <MediaGrid>
          {albums.slice(0, 6).map(album => (
            <MediaItemContainer key={album.uri} onClick={() => playItem(album)}>
              <MediaImage imageUrl={album.image} />
              <MediaName>{album.name}</MediaName>
              <MediaArtist>
                {album.artists.map(artist => artist.name).join(", ")}
              </MediaArtist>
            </MediaItemContainer>
          ))}
        </MediaGrid>
      </div>
    );
  };

  const renderTracks = (tracks: Track[]) => {
    if (!tracks || tracks.length === 0) return null;
    if (activeFilter !== "all" && activeFilter !== "track") return null;

    return (
      <div>
        {activeFilter === "all" && <SectionTitle>Tracks</SectionTitle>}
        <TrackListContainer>
          {tracks.slice(0, 5).map(track => (
            <TrackItem key={track.uri} onClick={() => playItem(track)}>
              <TrackImage imageUrl={track.image || track.album?.image} />
              <TrackInfo>
                <TrackName>{track.name}</TrackName>
                <TrackArtist>
                  {track.artists.map(artist => artist.name).join(", ")}
                </TrackArtist>
              </TrackInfo>
            </TrackItem>
          ))}
        </TrackListContainer>
      </div>
    );
  };

  const renderPlaylists = (playlists: Playlist[]) => {
    if (!playlists || playlists.length === 0) return null;
    if (activeFilter !== "all" && activeFilter !== "playlist") return null;

    return (
      <div>
        {activeFilter === "all" && <SectionTitle>Playlists</SectionTitle>}
        <MediaGrid>
          {playlists.slice(0, 6).map(playlist => (
            <MediaItemContainer
              key={playlist.uri}
              onClick={() => playItem(playlist)}
            >
              <MediaImage imageUrl={playlist.image} />
              <MediaName>{playlist.name}</MediaName>
            </MediaItemContainer>
          ))}
        </MediaGrid>
      </div>
    );
  };

  return (
    <SearchContainer>
      <Input placeholder="Search.." onChange={setQuery} value={query} />
      <FilterContainer>
        <Chip
          onClick={() => setActiveFilter("all")}
          icon="mdi:all-inclusive"
          style={{
            opacity: activeFilter === "all" ? 1 : 0.6,
            fontWeight: activeFilter === "all" ? "bold" : "normal",
          }}
        >
          All
        </Chip>
        <Chip
          onClick={() => setActiveFilter("artist")}
          icon="mdi:account-music"
          style={{
            opacity: activeFilter === "artist" ? 1 : 0.6,
            fontWeight: activeFilter === "artist" ? "bold" : "normal",
          }}
        >
          Artists
        </Chip>
        <Chip
          onClick={() => setActiveFilter("album")}
          icon="mdi:album"
          style={{
            opacity: activeFilter === "album" ? 1 : 0.6,
            fontWeight: activeFilter === "album" ? "bold" : "normal",
          }}
        >
          Albums
        </Chip>
        <Chip
          onClick={() => setActiveFilter("track")}
          icon="mdi:music-note"
          style={{
            opacity: activeFilter === "track" ? 1 : 0.6,
            fontWeight: activeFilter === "track" ? "bold" : "normal",
          }}
        >
          Tracks
        </Chip>
        <Chip
          onClick={() => setActiveFilter("playlist")}
          icon="mdi:playlist-music"
          style={{
            opacity: activeFilter === "playlist" ? 1 : 0.6,
            fontWeight: activeFilter === "playlist" ? "bold" : "normal",
          }}
        >
          Playlists
        </Chip>
      </FilterContainer>
      {results && (
        <ResultsContainer>
          {renderArtists(results.artists)}
          {renderAlbums(results.albums)}
          {renderTracks(results.tracks)}
          {renderPlaylists(results.playlists)}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};
