import { MaFilterConfig, MaMediaType } from "./types";

export const filters: MaFilterConfig[] = [
  { type: "all", label: "All", icon: "mdi:all-inclusive" },
  { type: "artist", label: "Artists", icon: "mdi:account-music" },
  { type: "album", label: "Albums", icon: "mdi:album" },
  { type: "track", label: "Tracks", icon: "mdi:music-note" },
  { type: "playlist", label: "Playlists", icon: "mdi:playlist-music" },
  { type: "radio", label: "Radio", icon: "mdi:radio" },
  { type: "audiobook", label: "Audiobooks", icon: "mdi:book" },
  { type: "podcast", label: "Podcasts", icon: "mdi:podcast" },
];

export const responseKeyMediaTypeMap: { [key: string]: MaMediaType } = {
  artists: "artist",
  albums: "album",
  tracks: "track",
  playlists: "playlist",
  radio: "radio",
  audiobooks: "audiobook",
  podcasts: "podcast",
};

export const labelMap: { [key in MaMediaType]: string } = {
  artist: "Artists",
  album: "Albums",
  track: "Tracks",
  playlist: "Playlists",
  radio: "Radio",
  audiobook: "Audiobooks",
  podcast: "Podcasts",
};
