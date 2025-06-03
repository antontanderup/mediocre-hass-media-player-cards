import { type } from "arktype";
import { interactionConfigSchema } from "./actionTypes";

const commonMediocreMediaPlayerCardConfigSchema = type({
  type: "string",
  entity_id: "string",
  "use_art_colors?": "boolean",
  "action?": interactionConfigSchema,
  "speaker_group?": {
    "entity_id?": "string | undefined", // entity_id of the main speaker incase it's different from the entity_id of the media player
    entities: "string[]", // entity_ids of the speakers that can be grouped with the main speaker
  },
  "custom_buttons?": type({
    icon: "string > 0",
    name: "string > 0",
  })
    .and(interactionConfigSchema)
    .array(),
  "ma_entity_id?": "string", // MusicAssistant entity_id (adds MA specific features (currently search))
  "search?": {
    "enabled?": "boolean", // Enables regular Home Assistant search_media functionality
    "show_favorites?": "boolean", // Shows favorites no search query has been entered
    "entity_id?": "string | undefined", // entity_id of the media player to search on (optional will fall back to the entity_id of the card)
  },
});

export const MediocreMediaPlayerCardConfigSchema =
  commonMediocreMediaPlayerCardConfigSchema.and({
    "tap_opens_popup?": "boolean",
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
