import type { OverlayMenuItem } from "@components/OverlayMenu/OverlayMenu";

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

// Unified browser item for rendering
export type LyrionBrowserItem = {
  id: string;
  title: string;
  type:
    | "artist"
    | "album"
    | "track"
    | "genre"
    | "playlist"
    | "category"
    | "app";
  can_play: boolean;
  can_expand: boolean;
  url?: string;
  thumbnail?: string;
  subtitle?: string;
  artworkTrackId?: string;
  duration?: number;
  onClick?: () => void;
  menuItems?: OverlayMenuItem[];
};

// Navigation state item (for breadcrumbs)
export type LyrionNavigationItem = {
  id: string;
  title: string;
  command: string;
  parameters: string[];
  type: LyrionBrowserItem["type"];
};
