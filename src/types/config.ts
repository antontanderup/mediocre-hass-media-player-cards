import { type } from "arktype";
import { interactionConfigSchema } from "./actionTypes";

const commonMediocreMediaPlayerCardConfigOptionsSchema = type({
  "always_show_power_button?": "boolean | null", // Always show the power button, even if the media player is on
  "always_show_footer_more_actions?": "boolean", // Always show the footer more-actions button in the large view, even when no custom buttons are configured
  "media_browser_view_icon?": "string", // Icon for the media browser tab in the large footer navigation
  "media_browser_view_title?": "string", // Custom title shown for the large Browse Media view
  "player_view_icon?": "string", // Icon for the main player tab in the large footer navigation
  "search_view_title?": "string", // Custom title shown for the large search view
  "show_volume_step_buttons?": "boolean", // Show volume step buttons + - on volume sliders
  "use_volume_up_down_for_step_buttons?": "boolean", // Use volume_up and volume_down services for step buttons instead of setting volume using set_volume. This breaks volume sync when step buttons are used.
  "use_experimental_lms_media_browser?": "boolean", // Use the experimental LMS media browser instead of the default one when an LMS entity is used and lyrion_cli integration is present.
  "volume_trailing_button?": "'power' | 'ma_favorite' | 'group_volume' | 'custom' | 'none'", // Button shown to the right of the large view volume slider
});

const maFavoriteControlSchema = type({
  "enabled?": "boolean | null", // Enables Music Assistant favorite controls
  "active_icon?": "string", // Icon shown when current item is favorited
  "inactive_icon?": "string", // Icon shown when current item is not favorited
  "active_color?": "string", // Color shown when current item is favorited
  "show_on_artwork?": "boolean | null", // Shows the favorite button as an overlay on the main artwork
  "artwork_button_size?":
    "'xx-small' | 'x-small' | 'small' | 'medium' | 'large'", // Size of the artwork overlay button
  "artwork_inset_top?": "string", // Top inset for the artwork overlay button (e.g. 14px or 1rem)
  "artwork_inset_right?": "string", // Right inset for the artwork overlay button (e.g. 14px or 1rem)
});

const volumePanelEntitySchema = type({
  entity_id: "string",
  "name?": "string | null",
  "icon?": "string | null",
  "show_power?": "boolean | null",
  "power_entity_id?": type("string").or("null").or("undefined"),
});

const volumePanelGroupSchema = type({
  "name?": "string | null",
  entities: volumePanelEntitySchema.array(),
});

const volumePanelSchema = type({
  "show_when?": "'grouped' | 'always'",
  "entities?": volumePanelEntitySchema.array().or("undefined"),
  "groups?": volumePanelGroupSchema.array().or("undefined"),
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

const mediaBrowserEntry = type({
  "name?": "string | null",
  entity_id: type("string"),
  "media_types?": searchMediaTypeSchema.array().or("undefined"),
});
const mediaBrowserLegacyEntry = type({
  "enabled?": "boolean | null", // Enables media browser functionality
  "entity_id?": type("string").or("null").or("undefined"), // entity_id of the media browser to use (optional will fall back to the entity_id of the card)
  "media_types?": searchMediaTypeSchema.array().or("undefined"),
});

const mediaBrowser = type("null")
  .or(mediaBrowserLegacyEntry)
  .or(mediaBrowserEntry.array());

const customButton = type({
  icon: "string > 0",
  name: "string > 0",
}).and(interactionConfigSchema);

const customButtons = customButton.array();

const searchLegacyEntry = type({
  "enabled?": "boolean | null", // Enables regular Home Assistant search_media functionality
  "show_favorites?": type("boolean | null").or("undefined"), // Shows favorites no search query has been entered
  "entity_id?": type("string").or("null").or("undefined"), // entity_id of the media player to search on (optional will fall back to the entity_id of the card)
  "media_types?": searchMediaTypeSchema.array(),
});

const searchEntry = type({
  "name?": "string | null",
  entity_id: type("string"),
  "media_types?": searchMediaTypeSchema.array().or("undefined"),
});

const searchConfig = searchEntry.array().or(searchLegacyEntry).or("undefined");

const commonMediocreMediaPlayerCardConfigSchema = type({
  type: "string",
  "name?": "string | null",
  entity_id: "string",
  "use_art_colors?": "boolean",
  "action?": interactionConfigSchema,
  "speaker_group?": {
    "entity_id?": type("string").or("null").or("undefined"), // entity_id of the main speaker incase it's different from the entity_id of the media player
    entities: mediaPlayerConfigEntityArray, // entity_ids of the speakers that can be grouped with the main speaker
  },
  "custom_buttons?": customButtons,
  "ma_entity_id?": type("string").or("null").or("undefined"), // MusicAssistant entity_id (adds MA specific features (currently search))
  "ma_favorite_button_entity_id?": type("string").or("null").or("undefined"), // MusicAssistant button entity to mark current song as favorite
  "lms_entity_id?": type("string").or("null").or("undefined"), // LMS entity_id (adds LMS specific features)
  "search?": searchConfig,
  "media_browser?": mediaBrowser,
  "ma_favorite_control?": maFavoriteControlSchema.or("undefined"),
  "volume_panel?": volumePanelSchema.or("undefined"),
  "volume_trailing_button_custom_button?":
    customButton.or("null").or("undefined"),
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
    mode: "'panel'|'card'|'in-card'|'popup'", // don't document popup and multi as they are only for internal use
  });

export const MediocreMultiMediaPlayer = type({
  entity_id: "string",
  "custom_buttons?": customButtons,
  "name?": "string | null",
  "speaker_group_entity_id?": type("string").or("null").or("undefined"), // entity_id of the main speaker incase it's different from the entity_id of the media player
  "can_be_grouped?": "boolean | null",
  "ma_entity_id?": type("string").or("null").or("undefined"), // MusicAssistant entity_id (adds MA specific features (currently search))
  "ma_favorite_button_entity_id?": type("string").or("null").or("undefined"), // MusicAssistant button entity to mark current song as favorite
  "lms_entity_id?": type("string").or("null").or("undefined"), // LMS entity_id (adds LMS specific features)
  "search?": searchConfig,
  "media_browser?": mediaBrowser,
  "ma_favorite_control?": maFavoriteControlSchema.or("undefined"),
  "volume_panel?": volumePanelSchema.or("undefined"),
  "volume_trailing_button_custom_button?":
    customButton.or("null").or("undefined"),
  "action?": interactionConfigSchema,
});

export const commonMediaPlayerCardOptions = type({
  "always_show_footer_more_actions?": "boolean", // Always show the footer more-actions button in the large view, even when no custom buttons are configured
  "media_browser_view_icon?": "string", // Icon for the media browser tab in the large footer navigation
  "media_browser_view_title?": "string", // Custom title shown for the large Browse Media view
  "player_view_icon?": "string", // Icon for the main player tab in the large footer navigation
  "player_is_active_when?": "'playing' | 'playing_or_paused'", // When to consider a media player as active.
  "search_view_title?": "string", // Custom title shown for the large search view
  "show_volume_step_buttons?": "boolean", // Show volume step buttons + - on volume sliders
  "use_volume_up_down_for_step_buttons?": "boolean", // Use volume_up and volume_down services for step buttons instead of setting volume using set_volume. This breaks volume sync when step buttons are used.
  "use_experimental_lms_media_browser?": "boolean", // Use the experimental LMS media browser instead of the default one when an LMS entity is used and lyrion_cli integration is present.
  "volume_trailing_button?": "'power' | 'ma_favorite' | 'group_volume' | 'custom' | 'none'", // Button shown to the right of the large view volume slider
});

export const commonMediaPlayerCardSchema = type({
  type: "string",
  entity_id: "string", // entity id of the initially selected media player (used when player is active)
  media_players: MediocreMultiMediaPlayer.array(),
  "media_browser?": mediaBrowser,
  "ma_favorite_control?": maFavoriteControlSchema.or("undefined"),
  "use_art_colors?": "boolean",
  "disable_player_focus_switching?": "boolean",
  "grid_options?": "unknown", // Home Assistant grid layout options (passed through without validation)
  "visibility?": "unknown", // Home Assistant visibility options (passed through without validation)
});

export const MediocreMultiMediaPlayerCardConfigSchema =
  commonMediaPlayerCardSchema.and(
    type({
      size: "'large'",
      mode: "'panel'|'card'|'in-card'",
      "height?": "number | string", // height of the card (can be a number in px or a string with any css unit)
      "options?": commonMediaPlayerCardOptions.and({
        "hide_selected_player_header?": "boolean", // Hide the header of the selected player in the massive view
        "transparent_background_on_home?": "boolean", // Makes the background transparent when the showing the massive player
        "default_tab?":
          "'massive'|'search'|'media-browser'|'speaker-grouping'|'custom-buttons'|'queue'", // The tab to show by default when the card loads
      }),
    }).or(
      type({
        size: "'compact'",
        "tap_opens_popup?": "boolean",
        "options?": commonMediaPlayerCardOptions.and({
          "always_show_power_button?": "boolean | null", // Always show the power button, even if the media player is on
          "always_show_custom_buttons?": "boolean | null", // Always show custom buttons panel expanded
          "hide_when_off?": "boolean | null", // Hide the card when the media player is off
          "hide_when_group_child?": "boolean | null", // Hide the card when the media player is a group child
        }),
      })
    )
  );

export type SearchMediaType = typeof searchMediaTypeSchema.infer;
export type CommonMediocreMediaPlayerCardConfig =
  typeof commonMediocreMediaPlayerCardConfigSchema.infer;
export type MediocreMediaPlayerCardConfig =
  typeof MediocreMediaPlayerCardConfigSchema.infer;
export type MediocreMassiveMediaPlayerCardConfig =
  typeof MediocreMassiveMediaPlayerCardConfigSchema.infer;
export type MediocreMultiMediaPlayerCardConfig =
  typeof MediocreMultiMediaPlayerCardConfigSchema.infer;
export type MediocreMultiMediaPlayer = typeof MediocreMultiMediaPlayer.infer;
export type MediaPlayerConfigEntity = typeof mediaPlayerConfigEntity.infer;
export type MediaBrowserConfig = typeof mediaBrowser.infer;
export type MediaBrowserEntry = typeof mediaBrowserEntry.infer;
export type MediaBrowserLegacyEntry = typeof mediaBrowserLegacyEntry.infer;
export type CustomButton = typeof customButton.infer;
export type CustomButtons = typeof customButtons.infer;
export type MaFavoriteControl = typeof maFavoriteControlSchema.infer;
export type VolumePanel = typeof volumePanelSchema.infer;
export type VolumePanelGroup = typeof volumePanelGroupSchema.infer;
export type VolumePanelEntity = typeof volumePanelEntitySchema.infer;
export type SearchConfig = typeof searchConfig.infer;
export type SearchLegacyEntry = typeof searchLegacyEntry.infer;
export type SearchEntry = typeof searchEntry.infer;
