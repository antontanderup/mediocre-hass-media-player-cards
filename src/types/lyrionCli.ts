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
