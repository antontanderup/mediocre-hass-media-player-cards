import {
  MediocreMediaPlayerCardConfig,
  MediocreMassiveMediaPlayerCardConfig,
} from "@types";

/**
 * Creates default values from a regular media player card config
 */
export const getDefaultValuesFromConfig = (
  config: MediocreMediaPlayerCardConfig
): MediocreMediaPlayerCardConfig => ({
  type: config.type ?? `custom:mediocre-media-player-card`,
  entity_id: config?.entity_id ?? "",
  use_art_colors: config?.use_art_colors ?? false,
  tap_opens_popup: config?.tap_opens_popup ?? false,
  action: config?.action ?? {},
  speaker_group: {
    entity_id: config?.speaker_group?.entity_id ?? null,
    entities: config?.speaker_group?.entities ?? [],
  },
  search: {
    enabled: config?.search?.enabled ?? false,
    show_favorites: config?.search?.show_favorites ?? false,
    entity_id: config?.search?.entity_id ?? null,
    media_types: config?.search?.media_types ?? [],
  },
  queue: {
    enabled: config?.queue?.enabled ?? false,
  },
  ma_entity_id: config?.ma_entity_id ?? null,
  ma_favorite_button_entity_id: config?.ma_favorite_button_entity_id ?? null,
  custom_buttons: config?.custom_buttons ?? [],
  options: {
    always_show_power_button:
      config?.options?.always_show_power_button ?? false,
    always_show_custom_buttons:
      config?.options?.always_show_custom_buttons ?? false,
  },
  grid_options: config?.grid_options,
  visibility: config?.visibility,
});

/**
 * Creates default values from a massive media player card config
 */
export const getDefaultValuesFromMassiveConfig = (
  config: MediocreMassiveMediaPlayerCardConfig
): MediocreMassiveMediaPlayerCardConfig => ({
  type: config.type ?? `custom:mediocre-massive-media-player-card`,
  entity_id: config?.entity_id ?? "",
  use_art_colors: config?.use_art_colors ?? false,
  mode: config?.mode ?? "card",
  action: config?.action ?? {},
  speaker_group: {
    entity_id: config?.speaker_group?.entity_id ?? null,
    entities: config?.speaker_group?.entities ?? [],
  },
  search: {
    enabled: config?.search?.enabled ?? false,
    show_favorites: config?.search?.show_favorites ?? false,
    entity_id: config?.search?.entity_id ?? null,
    media_types: config?.search?.media_types ?? [],
  },
  queue: {
    enabled: config?.queue?.enabled ?? false,
  },
  ma_entity_id: config?.ma_entity_id ?? null,
  ma_favorite_button_entity_id: config?.ma_favorite_button_entity_id ?? null,
  custom_buttons: config?.custom_buttons ?? [],
  options: {
    always_show_power_button:
      config?.options?.always_show_power_button ?? false,
  },
  grid_options: config?.grid_options,
  visibility: config?.visibility,
});

/**
 * Removes unnecessary values from regular media player card config while preserving grid_options
 */
export const getSimpleConfigFromFormValues = (
  formValues: MediocreMediaPlayerCardConfig
): MediocreMediaPlayerCardConfig => {
  const config: MediocreMediaPlayerCardConfig = { ...formValues };

  // Remove falsy or empty values
  if (!config.use_art_colors) delete config.use_art_colors;
  if (!config.tap_opens_popup) delete config.tap_opens_popup;
  if (!config.action || Object.keys(config.action).length === 0)
    delete config.action;
  if (!config.ma_entity_id) delete config.ma_entity_id;

  // Only preserve ma_favorite_button_entity_id if it is a non-empty string
  if (!config.ma_favorite_button_entity_id) {
    delete config.ma_favorite_button_entity_id;
  }
  if (!config.custom_buttons || config.custom_buttons.length === 0)
    delete config.custom_buttons;

  if (config.speaker_group?.entity_id === null) {
    delete config.speaker_group.entity_id;
  }

  // Handle speaker_group - remove if no entity_id and no entities
  if (
    !config.speaker_group?.entity_id &&
    (!config.speaker_group?.entities ||
      config.speaker_group.entities.length === 0)
  ) {
    delete config.speaker_group;
  }

  if (config.search?.entity_id === null) {
    delete config.search.entity_id;
  }

  if (config.search?.media_types?.length === 0) {
    delete config.search.media_types;
  }

  // Handle search - remove if all search properties are falsy
  if (
    !config.search?.enabled &&
    !config.search?.show_favorites &&
    !config.search?.entity_id &&
    !config.search?.media_types
  ) {
    delete config.search;
  }

  if (!config.queue?.enabled) {
    delete config.queue;
  }

  if (config.options?.always_show_power_button === false) {
    delete config.options.always_show_power_button;
  }
  if (config.options?.always_show_custom_buttons === false) {
    delete config.options.always_show_custom_buttons;
  }
  if (Object.keys(config.options ?? {}).length === 0) {
    delete config.options;
  }

  // Always preserve grid_options and visibility as theyr'e Home Assistant configurations
  // that we should not mess with

  return config;
};

/**
 * Removes unnecessary values from massive media player card config while preserving grid_options
 */
export const getSimpleConfigFromMassiveFormValues = (
  formValues: MediocreMassiveMediaPlayerCardConfig
): MediocreMassiveMediaPlayerCardConfig => {
  const config: MediocreMassiveMediaPlayerCardConfig = { ...formValues };

  // Remove falsy or empty values
  if (!config.use_art_colors) delete config.use_art_colors;
  if (!config.action || Object.keys(config.action).length === 0)
    delete config.action;
  if (!config.ma_entity_id) delete config.ma_entity_id;

  // Only preserve ma_favorite_button_entity_id if it is a non-empty string
  if (!config.ma_favorite_button_entity_id) {
    delete config.ma_favorite_button_entity_id;
  }

  if (!config.custom_buttons || config.custom_buttons.length === 0)
    delete config.custom_buttons;

  if (config.speaker_group?.entity_id === null) {
    delete config.speaker_group.entity_id;
  }

  // Handle speaker_group - remove if no entity_id and no entities
  if (
    !config.speaker_group?.entity_id &&
    (!config.speaker_group?.entities ||
      config.speaker_group.entities.length === 0)
  ) {
    delete config.speaker_group;
  }

  if (config.search?.entity_id === null) {
    delete config.search.entity_id;
  }

  if (config.search?.media_types?.length === 0) {
    delete config.search.media_types;
  }

  // Handle search - remove if all search properties are falsy
  if (
    !config.search?.enabled &&
    !config.search?.show_favorites &&
    !config.search?.entity_id &&
    !config.search?.media_types
  ) {
    delete config.search;
  }

  if (!config.queue?.enabled) {
    delete config.queue;
  }

  if (config.options?.always_show_power_button === false) {
    delete config.options.always_show_power_button;
  }
  if (!config.options?.always_show_power_button) {
    delete config.options;
  }

  // Always preserve grid_options and visibility as theyr'e Home Assistant configurations
  // that we should not mess with

  return config;
};
