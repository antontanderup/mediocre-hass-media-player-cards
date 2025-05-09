// Media types
export type HaMediaClass =
  | "artist"
  | "album"
  | "track"
  | "playlist"
  | "music"
  | "podcast";

// Filter types (includes "all" in addition to HaMediaClass)
export type HaFilterType = "all" | HaMediaClass;

export type HaContentType = //image, music, tv show, video, episode, channel, or playlist
  "image" | "music" | "tv_show" | "video" | "episode" | "channel" | "playlist";

// Enqueue modes for media playback
export type HaEnqueueMode = "add" | "next" | "play" | "replace";

// Filter configuration type
export interface HaFilterConfig {
  type: HaFilterType;
  label: string;
  icon: string;
}

// Base media item interface
export interface HaMediaItem {
  media_class: HaMediaClass;
  media_content_id: string;
  media_content_type: HaContentType;
  title: string;
  can_play: boolean;
  thumbnail: string | null;
}

// Search response interface
export interface HaSearchResponse {
  result: HaMediaItem[];
}
