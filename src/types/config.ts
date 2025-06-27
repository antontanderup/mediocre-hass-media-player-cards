import { type } from "arktype";
import { interactionConfigSchema } from "./actionTypes";

const commonMediocreMediaPlayerCardConfigOptionsSchema = type({
  "always_show_power_button?": "boolean | null", // Always show the power button, even if the media player is on
});

const commonMediocreMediaPlayerCardConfigSchema = type({
  type: "string",
  entity_id: "string",
  "use_art_colors?": "boolean",
  "action?": interactionConfigSchema,
  "speaker_group?": {
    "entity_id?": type("string").or("null"), // entity_id of the main speaker incase it's different from the entity_id of the media player
    entities: "string[]", // entity_ids of the speakers that can be grouped with the main speaker
  },
  "custom_buttons?": type({
    icon: "string > 0",
    name: "string > 0",
  })
    .and(interactionConfigSchema)
    .array(),
  "ma_entity_id?": type("string").or("null"), // MusicAssistant entity_id (adds MA specific features (currently search))
  "search?": {
    "enabled?": "boolean | null", // Enables regular Home Assistant search_media functionality
    "show_favorites?": "boolean | null", // Shows favorites no search query has been entered
    "entity_id?": type("string").or("null"), // entity_id of the media player to search on (optional will fall back to the entity_id of the card)
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
    }),
  });

export const MediocreMassiveMediaPlayerCardConfigSchema =
  commonMediocreMediaPlayerCardConfigSchema.and({
    mode: "'panel'|'card'|'in-card'|'popup'", // don't document popup as it only for internal use
  });

export type CommonMediocreMediaPlayerCardConfig =
  typeof commonMediocreMediaPlayerCardConfigSchema.infer;
export type MediocreMediaPlayerCardConfig =
  typeof MediocreMediaPlayerCardConfigSchema.infer;
export type MediocreMassiveMediaPlayerCardConfig =
  typeof MediocreMassiveMediaPlayerCardConfigSchema.infer;
