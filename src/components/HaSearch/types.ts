// Media types
export type HaMediaClass =
  | "artist"
  | "album"
  | "track"
  | "playlist"
  | "music"
  | "podcast";

// Filter types (includes "all" in addition to HaMediaClass)
export type HaFilterType = "all" | HaContentType;

export type HaContentType =
  | "tracks"
  | "albums"
  | "artists"
  | "playlists"
  | "music";

// Enqueue modes for media playback
export type HaEnqueueMode = "add" | "next" | "play" | "replace";

// Filter configuration type
export interface HaFilterConfig {
  type: HaFilterType;
  label: string;
  icon: string;
}

export type HaFilterResult = (HaFilterConfig & {
  results: HaMediaItem[];
})[];

// Base media item interface
export interface HaMediaItem {
  media_class: HaMediaClass;
  media_content_id: string;
  media_content_type: HaContentType;
  title: string;
  can_play: boolean;
  can_expand: boolean;
  can_search: boolean;
  thumbnail: string | null;
}

// Search response interface
export interface HaSearchResponse {
  result: HaMediaItem[];
}
