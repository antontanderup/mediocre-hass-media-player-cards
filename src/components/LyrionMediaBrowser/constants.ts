import type { LyrionNavigationItem, LyrionCategoryType } from "./types";

export type BrowserHistoryEntry = LyrionNavigationItem & { filter: string };

export const HOME_ENTRY: BrowserHistoryEntry = {
  id: "home",
  title: "Home",
  command: "",
  parameters: [],
  type: "category",
  filter: "",
};

// Category definitions for home screen
export const CATEGORIES: Array<{
  id: LyrionCategoryType;
  title: string;
  icon: string;
}> = [
  { id: "artists", title: "Artists", icon: "mdi:account-music" },
  {
    id: "albumartists",
    title: "Album Artists",
    icon: "mdi:account-music-outline",
  },
  { id: "albums", title: "Albums", icon: "mdi:album" },
  { id: "newmusic", title: "New Music", icon: "mdi:new-box" },
  { id: "genres", title: "Genres", icon: "mdi:music-box-multiple" },
  { id: "playlists", title: "Playlists", icon: "mdi:playlist-music" },
  { id: "tracks", title: "Tracks", icon: "mdi:music-note" },
  { id: "favorites", title: "Favorites", icon: "mdi:star" },
  { id: "radios", title: "Radio", icon: "mdi:radio" },
  { id: "apps", title: "Apps", icon: "mdi:apps" },
];

// Maps category IDs to their LMS command and extra parameters
export const CATEGORY_COMMANDS: Partial<
  Record<LyrionCategoryType, { command: string; parameters: string[] }>
> = {
  tracks: { command: "titles", parameters: [] },
  albumartists: { command: "artists", parameters: ["role_id:ALBUMARTIST"] },
  newmusic: { command: "albums", parameters: ["sort:new"] },
};
