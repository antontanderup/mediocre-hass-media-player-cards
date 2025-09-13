import { type } from "arktype";
import { interactionConfigSchema } from "./actionTypes";

const commonMediocreMediaPlayerCardConfigOptionsSchema = type({
  "always_show_power_button?": "boolean | null", // Always show the power button, even if the media player is on
});

const searchMediaTypeSchema = type({
  "icon?": "string",
  "name?": "string",
  media_type: "string",
});

export const mediaPlayerConfigEntity = type({
  entity: "string",
  "name?": "string | null",
}).or("string");

export const mediaPlayerConfigEntityArray = mediaPlayerConfigEntity.array();

const commonMediocreMediaPlayerCardConfigSchema = type({
  type: "string",
  entity_id: "string",
  "use_art_colors?": "boolean",
  "action?": interactionConfigSchema,
  "speaker_group?": {
    "entity_id?": type("string").or("null"), // entity_id of the main speaker incase it's different from the entity_id of the media player
    entities: mediaPlayerConfigEntityArray, // entity_ids of the speakers that can be grouped with the main speaker
  },
  "custom_buttons?": type({
    icon: "string > 0",
    name: "string > 0",
  })
    .and(interactionConfigSchema)
    .array(),
  "ma_entity_id?": type("string").or("null"), // MusicAssistant entity_id (adds MA specific features (currently search))
  "ma_favorite_button_entity_id?": type("string").or("null"), // MusicAssistant button entity to mark current song as favorite
  "search?": {
    "enabled?": "boolean | null", // Enables regular Home Assistant search_media functionality
    "show_favorites?": "boolean | null", // Shows favorites no search query has been entered
    "entity_id?": type("string").or("null"), // entity_id of the media player to search on (optional will fall back to the entity_id of the card)
    "media_types?": searchMediaTypeSchema.array(),
  },
  "options?": commonMediocreMediaPlayerCardConfigOptionsSchema,
  "grid_options?": "unknown", // Home Assistant grid layout options (passed through without validation)
  "visibility?": "unknown", // Home Assistant visibility options (passed through without validation)
});

export const MediocreMediaPlayerCardConfigSchema =
  commonMediocreMediaPlayerCardConfigSchema.and({
    "tap_opens_popup?": "boolean",
    "options?": commonMediocreMediaPlayerCardConfigOptionsSchema.and({
      "always_show_custom_buttons?": "boolean | null", // Always show custom buttons panel expanded
      "hide_when_off?": "boolean | null", // Hide the card when the media player is off
      "hide_when_group_child?": "boolean | null", // Hide the card when the media player is a group child
    }),
  });

export const MediocreMassiveMediaPlayerCardConfigSchema =
  commonMediocreMediaPlayerCardConfigSchema.and({
    mode: "'panel'|'card'|'in-card'|'popup'", // don't document popup as it only for internal use
  });

export const MediocreMultiMediaPlayerCardConfigSchema = type({
  type: "string",
  media_players: type({
    entity_id: "string",
    "use_art_colors?": "boolean",
    "custom_buttons?": type({
      icon: "string > 0",
      name: "string > 0",
    }),
    "speaker_group_entity_id?": type("string").or("null"), // entity_id of the main speaker incase it's different from the entity_id of the media player
    "ma_entity_id?": type("string").or("null"), // MusicAssistant entity_id (adds MA specific features (currently search))
    "ma_favorite_button_entity_id?": type("string").or("null"), // MusicAssistant button entity to mark current song as favorite
    "search?": {
      "enabled?": "boolean | null", // Enables regular Home Assistant search_media functionality
      "show_favorites?": "boolean | null", // Shows favorites no search query has been entered
      "entity_id?": type("string").or("null"), // entity_id of the media player to search on (optional will fall back to the entity_id of the card)
      "media_types?": searchMediaTypeSchema.array(),
    },
  }).array(),
  "speaker_group?": {
    entities: mediaPlayerConfigEntityArray, // entity_ids of the speakers that can be grouped with the main speaker
  },
  "grid_options?": "unknown", // Home Assistant grid layout options (passed through without validation)
  "visibility?": "unknown", // Home Assistant visibility options (passed through without validation)
});

export type SearchMediaType = typeof searchMediaTypeSchema.infer;
export type CommonMediocreMediaPlayerCardConfig =
  typeof commonMediocreMediaPlayerCardConfigSchema.infer;
export type MediocreMediaPlayerCardConfig =
  typeof MediocreMediaPlayerCardConfigSchema.infer;
export type MediocreMassiveMediaPlayerCardConfig =
  typeof MediocreMassiveMediaPlayerCardConfigSchema.infer;
export type MediocreMultiMediaPlayerCardConfig =
  typeof MediocreMultiMediaPlayerCardConfigSchema.infer;
export type MediaPlayerConfigEntity = typeof mediaPlayerConfigEntity.infer;
