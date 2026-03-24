// Media types
export type MaMediaType =
  | "artist"
  | "album"
  | "track"
  | "playlist"
  | "radio"
  | "genre"
  | "audiobook"
  | "podcast";

// Filter types (includes "all" in addition to MaMediaType)
export type MaFilterType = "all" | "music" | MaMediaType;

// Enqueue modes for media playback
export type MaEnqueueMode =
  | "play"
  | "replace"
  | "next"
  | "replace_next"
  | "add";

export type MaViewMode = "list" | "thumbs" | "compact_thumbs";

// Filter configuration type
export interface MaFilterConfig {
  type: MaFilterType;
  label: string;
  icon: string;
}

// Base media item interface
export interface MaMediaItem {
  media_type: MaMediaType;
  uri: string;
  name: string;
  version: string;
  image: string | null;
}

// Artist interface
export interface MaArtist extends MaMediaItem {
  media_type: "artist";
}

// Album interface
export interface MaAlbum extends MaMediaItem {
  media_type: "album";
  artists: MaArtist[];
}

// Track interface
export interface MaTrack extends MaMediaItem {
  media_type: "track";
  artists: MaArtist[];
  album: MaAlbum;
}

// Playlist interface
export interface MaPlaylist extends MaMediaItem {
  media_type: "playlist";
}

// Radio interface
export interface MaRadio extends MaMediaItem {
  media_type: "radio";
}

export interface MaGenre extends MaMediaItem {
  media_type: "genre";
}

export interface MaPodcast extends MaMediaItem {
  media_type: "podcast";
}

export interface MaAudiobook extends MaMediaItem {
  media_type: "audiobook";
}

// Search response interface
export interface MaSearchResponse {
  artists: MaArtist[];
  albums: MaAlbum[];
  tracks: MaTrack[];
  playlists: MaPlaylist[];
  radio: MaRadio[];
  genres: MaGenre[];
  audiobooks: MaAudiobook[];
  podcasts: MaPodcast[];
}
