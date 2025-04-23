import { HassEntity } from "home-assistant-js-websocket";

export type MediaPlayerState =
  | "playing"
  | "paused"
  | "idle"
  | "off"
  | "on"
  | "standby"
  | "buffering"
  | "unavailable"
  | string; // Just to make things a bit easier type-wise
export type MediaPlayerRepeatMode = "off" | "all" | "one";

export type MediaPlayerSupportedFeatures = number;

export type MediaContentType =
  | "music"
  | "tvshow"
  | "movie"
  | "video"
  | "episode"
  | "channel"
  | "playlist"
  | "image"
  | "game"
  | "app"
  | string;

export type MediaPlayerDeviceClass = "tv" | "speaker" | "receiver";

export interface MediaPlayerEntityAttributes {
  media_duration?: number;
  media_position?: number;
  media_position_updated_at?: string; // ISO date string
  media_title?: string;
  media_artist?: string;
  media_album_name?: string;
  icon?: string;
  friendly_name?: string;
  entity_picture?: string;
  volume_level?: number; // 0.0 to 1.0
  is_volume_muted?: boolean;
  shuffle?: boolean;
  repeat?: MediaPlayerRepeatMode;
  supported_features?: MediaPlayerSupportedFeatures;
  group_members?: string[]; // Array of entity_ids
  source?: string;
  source_list?: string[];
  device_class?: MediaPlayerDeviceClass;
  media_content_id?: string;
  media_content_type?: MediaContentType;
}

export interface MediaPlayerEntity extends HassEntity {
  attributes: MediaPlayerEntityAttributes;
  state: MediaPlayerState;
}
