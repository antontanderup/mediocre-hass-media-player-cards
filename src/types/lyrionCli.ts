export type SqueezeboxPlaylistItem = {
  id: string;
  title: string;
  "playlist index": number;
};

export type SqueezeboxStatusResponse = {
  player_ip?: string;
  playlist_cur_index?: number;
  playlist_loop?: SqueezeboxPlaylistItem[];
  [key: string]: unknown;
};

export type SqueezeboxSongInfoLoopItem = {
  id?: string;
  title?: string;
  artist?: string;
  coverid?: string;
  duration?: number;
  coverart?: string;
  album?: string;
  modificationTime?: string;
  type?: string;
  bitrate?: string;
  remote?: number;
  year?: string;
  addedTime?: string;
  artwork_url?: string;
  lastUpdated?: string;
  live_edge?: string;
  artwork_track_id?: string;
};

export type SqueezeboxSonginfoResponse = {
  songinfo_loop?: SqueezeboxSongInfoLoopItem[];
  [key: string]: unknown;
};

export type SqueezeboxServerStatusResponse = {
  ip?: string;
  httpport?: string;
  [key: string]: unknown;
};

// Browse category type
export type LyrionCategoryType =
  | "artists"
  | "albumartists"
  | "albums"
  | "newmusic"
  | "genres"
  | "playlists"
  | "tracks"
  | "favorites"
  | "apps"
  | "radios";

// Individual item types from LMS responses
export type LyrionArtist = {
  id: string;
  artist: string;
  textkey?: string;
  // Search command returns different field names
  contributor_id?: string;
  contributor?: string;
};

export type LyrionAlbum = {
  id: string;
  album: string;
  artist?: string;
  artist_id?: string;
  artwork_track_id?: string;
  year?: number;
  // Search command returns different field names
  album_id?: string;
  artwork?: string;
  coverid?: string;
};

export type LyrionTrack = {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  album_id?: string;
  artist_id?: string;
  artwork_track_id?: string;
  duration?: number;
  tracknum?: number;
  // Search command returns different field names
  track_id?: string;
  track?: string;
  coverid?: string;
};

export type LyrionGenre = {
  id: string;
  genre: string;
  textkey?: string;
};

export type LyrionPlaylist = {
  id: string;
  playlist: string;
};

export type LyrionFavorite = {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  hasitems?: number;
  isaudio?: number;
  image?: string;
  icon?: string;
  artwork_url?: string;
  artist?: string;
  line1?: string;
  line2?: string;
};

export type LyrionApp = {
  cmd: string;
  name: string;
  icon?: string;
  weight?: number;
  type?: string;
};

// Response wrapper from lyrion_cli browse commands
export type LyrionBrowseResponse = {
  count: number;
  artists_loop?: LyrionArtist[];
  contributors_loop?: LyrionArtist[];
  albums_loop?: LyrionAlbum[];
  titles_loop?: LyrionTrack[];
  tracks_loop?: LyrionTrack[];
  genres_loop?: LyrionGenre[];
  playlists_loop?: LyrionPlaylist[];
  playlisttracks_loop?: LyrionTrack[];
  loop_loop?: LyrionFavorite[];
  appss_loop?: LyrionApp[];
  radioss_loop?: LyrionApp[];
};

// Unified browser item for rendering
export type LyrionBrowserItem = {
  id: string;
  title: string;
  type: "artist" | "album" | "track" | "genre" | "playlist" | "category" | "app";
  can_play: boolean;
  can_expand: boolean;
  thumbnail?: string;
  subtitle?: string;
  artworkTrackId?: string;
  duration?: number;
};

// Navigation state item (for breadcrumbs)
export type LyrionNavigationItem = {
  id: string;
  title: string;
  command: string;
  parameters: string[];
  type: LyrionBrowserItem["type"];
};
