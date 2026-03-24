import type { SearchMediaType } from "@types";
import { MaFilterConfig, MaFilterType, MaMediaType } from "./types";

export const filters: MaFilterConfig[] = [
  { type: "all", label: "All", icon: "mdi:all-inclusive" },
  { type: "artist", label: "Artists", icon: "mdi:account-music" },
  { type: "album", label: "Albums", icon: "mdi:album" },
  { type: "track", label: "Tracks", icon: "mdi:music-note" },
  { type: "playlist", label: "Playlists", icon: "mdi:playlist-music" },
  { type: "radio", label: "Radio", icon: "mdi:radio" },
  { type: "genre", label: "Genres", icon: "mdi:tag-multiple" },
  { type: "audiobook", label: "Audiobooks", icon: "mdi:book" },
  { type: "podcast", label: "Podcasts", icon: "mdi:podcast" },
];

export const musicMediaTypes: MaMediaType[] = ["artist", "album", "track"];

const filterAliases: Record<
  string,
  {
    type: MaFilterType;
    label: string;
    icon: string;
  }
> = {
  album: { type: "album", label: "Albums", icon: "mdi:album" },
  albums: { type: "album", label: "Albums", icon: "mdi:album" },
  all: { type: "all", label: "All", icon: "mdi:all-inclusive" },
  artist: { type: "artist", label: "Artists", icon: "mdi:account-music" },
  artists: { type: "artist", label: "Artists", icon: "mdi:account-music" },
  audiobook: { type: "audiobook", label: "Audiobooks", icon: "mdi:book" },
  audiobooks: { type: "audiobook", label: "Audiobooks", icon: "mdi:book" },
  genre: { type: "genre", label: "Genres", icon: "mdi:tag-multiple" },
  genres: { type: "genre", label: "Genres", icon: "mdi:tag-multiple" },
  music: { type: "music", label: "Music", icon: "mdi:music" },
  playlist: { type: "playlist", label: "Playlists", icon: "mdi:playlist-music" },
  playlists: { type: "playlist", label: "Playlists", icon: "mdi:playlist-music" },
  podcast: { type: "podcast", label: "Podcasts", icon: "mdi:podcast" },
  podcasts: { type: "podcast", label: "Podcasts", icon: "mdi:podcast" },
  radio: { type: "radio", label: "Radio", icon: "mdi:radio" },
  radios: { type: "radio", label: "Radio", icon: "mdi:radio" },
  track: { type: "track", label: "Tracks", icon: "mdi:music-note" },
  tracks: { type: "track", label: "Tracks", icon: "mdi:music-note" },
};

export const getMaFilterConfig = (
  filterConfig?: SearchMediaType[]
): MaFilterConfig[] => {
  if (!filterConfig?.length) return filters;

  const normalizedFilters = filterConfig.reduce<MaFilterConfig[]>(
    (acc, configuredFilter) => {
      const resolvedFilter =
        filterAliases[configuredFilter.media_type?.toLowerCase()];
      if (!resolvedFilter) return acc;
      if (acc.some(filter => filter.type === resolvedFilter.type)) return acc;

      acc.push({
        type: resolvedFilter.type,
        label: configuredFilter.name ?? resolvedFilter.label,
        icon: configuredFilter.icon ?? resolvedFilter.icon,
      });

      return acc;
    },
    []
  );

  if (!normalizedFilters.length) return filters;

  if (normalizedFilters.some(filter => filter.type === "all")) {
    return normalizedFilters;
  }

  return [filters[0], ...normalizedFilters];
};

export const responseKeyMediaTypeMap: { [key: string]: MaMediaType } = {
  artists: "artist",
  albums: "album",
  tracks: "track",
  playlists: "playlist",
  radio: "radio",
  genres: "genre",
  audiobooks: "audiobook",
  podcasts: "podcast",
};

export const labelMap: { [key in MaMediaType]: string } = {
  artist: "Artists",
  album: "Albums",
  track: "Tracks",
  playlist: "Playlists",
  radio: "Radio",
  genre: "Genres",
  audiobook: "Audiobooks",
  podcast: "Podcasts",
};
