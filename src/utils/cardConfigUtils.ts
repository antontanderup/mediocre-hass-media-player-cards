import {
  MaFavoriteControl,
  MediocreMediaPlayerCardConfig,
  MediocreMassiveMediaPlayerCardConfig,
} from "@types";
import { getSearchEntryArray } from "./getSearchEntryArray";

const getCleanFooterIcons = (
  footerIcons?: Record<string, string | undefined>
) => {
  const entries = Object.entries(footerIcons ?? {}).filter(
    ([, icon]) => !!icon?.trim()
  );

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

export const getCleanMaFavoriteControl = (
  control?: MaFavoriteControl | null
): MaFavoriteControl | undefined => {
  if (!control?.show_on_artwork) return undefined;

  const activeColor = control.active_color?.trim();
  const favoriteButtonOffset = control.favorite_button_offset?.trim();
  const inactiveColor = control.inactive_color?.trim();

  return {
    show_on_artwork: true,
    ...(control.favorite_button_size &&
    control.favorite_button_size !== "small"
      ? { favorite_button_size: control.favorite_button_size }
      : {}),
    ...(favoriteButtonOffset && favoriteButtonOffset !== "14px"
      ? { favorite_button_offset: favoriteButtonOffset }
      : {}),
    ...(activeColor && activeColor !== "#f2c94c"
      ? { active_color: activeColor }
      : {}),
    ...(inactiveColor && inactiveColor !== "#111111"
      ? { inactive_color: inactiveColor }
      : {}),
  };
};

/**
 * Creates default values from a regular media player card config
 */
export const getDefaultValuesFromConfig = (
  config: MediocreMediaPlayerCardConfig
): MediocreMediaPlayerCardConfig => ({
  type: config.type ?? `custom:mediocre-media-player-card`,
  entity_id: config?.entity_id ?? "",
  name: config?.name ?? null,
  use_art_colors: config?.use_art_colors ?? false,
  tap_opens_popup: config?.tap_opens_popup ?? false,
  action: config?.action ?? {},
  speaker_group: {
    entity_id: config?.speaker_group?.entity_id ?? null,
    entities: config?.speaker_group?.entities ?? [],
  },
  search: getSearchEntryArray(config.search, config.entity_id),
  media_browser: config?.media_browser
    ? Array.isArray(config.media_browser)
      ? config.media_browser
      : [{ entity_id: config.media_browser.entity_id ?? config.entity_id }]
    : null,
  ma_entity_id: config?.ma_entity_id ?? null,
  ma_favorite_button_entity_id: config?.ma_favorite_button_entity_id ?? null,
  ...(config?.ma_favorite_control
    ? { ma_favorite_control: { ...config.ma_favorite_control } }
    : {}),
  lms_entity_id: config?.lms_entity_id ?? null,
  custom_buttons: config?.custom_buttons ?? [],
  options: {
    always_show_power_button:
      config?.options?.always_show_power_button ?? false,
    always_show_custom_buttons:
      config?.options?.always_show_custom_buttons ?? false,
    hide_when_off: config?.options?.hide_when_off ?? false,
    hide_when_group_child: config?.options?.hide_when_group_child ?? false,
    show_volume_step_buttons:
      config?.options?.show_volume_step_buttons ?? false,
    use_volume_up_down_for_step_buttons:
      config?.options?.use_volume_up_down_for_step_buttons ?? false,
    use_experimental_lms_media_browser:
      config?.options?.use_experimental_lms_media_browser ?? false,
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
  search: getSearchEntryArray(config.search, config.entity_id),
  media_browser: config?.media_browser
    ? Array.isArray(config.media_browser)
      ? config.media_browser
      : [{ entity_id: config.media_browser.entity_id ?? config.entity_id }]
    : null,
  ma_entity_id: config?.ma_entity_id ?? null,
  ma_favorite_button_entity_id: config?.ma_favorite_button_entity_id ?? null,
  ...(config?.ma_favorite_control
    ? { ma_favorite_control: { ...config.ma_favorite_control } }
    : {}),
  lms_entity_id: config?.lms_entity_id ?? null,
  custom_buttons: config?.custom_buttons ?? [],
  options: {
    always_show_power_button:
      config?.options?.always_show_power_button ?? false,
    show_volume_step_buttons:
      config?.options?.show_volume_step_buttons ?? false,
    use_volume_up_down_for_step_buttons:
      config?.options?.use_volume_up_down_for_step_buttons ?? false,
    ...(config?.options?.ui?.footer_icons
      ? {
          ui: {
            footer_icons: {
              ...config.options.ui.footer_icons,
            },
          },
        }
      : {}),
    use_experimental_lms_media_browser:
      config?.options?.use_experimental_lms_media_browser ?? false,
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

  // Always preserve the name field (can be string or null)

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
  const maFavoriteControl = getCleanMaFavoriteControl(config.ma_favorite_control);
  if (maFavoriteControl) {
    config.ma_favorite_control = maFavoriteControl;
  } else {
    delete config.ma_favorite_control;
  }

  if (!config.lms_entity_id) delete config.lms_entity_id;
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

  if (config.options?.always_show_power_button === false) {
    delete config.options.always_show_power_button;
  }
  if (config.options?.always_show_custom_buttons === false) {
    delete config.options.always_show_custom_buttons;
  }
  if (config.options?.hide_when_off === false) {
    delete config.options.hide_when_off;
  }
  if (config.options?.hide_when_group_child === false) {
    delete config.options.hide_when_group_child;
  }

  if (config.options?.show_volume_step_buttons === false) {
    delete config.options.show_volume_step_buttons;
  }
  if (config.options?.use_volume_up_down_for_step_buttons === false) {
    delete config.options.use_volume_up_down_for_step_buttons;
  }
  if (config.options?.use_experimental_lms_media_browser === false) {
    delete config.options.use_experimental_lms_media_browser;
  }
  if (Object.keys(config.options ?? {}).length === 0) {
    delete config.options;
  }

  // Always preserve grid_options and visibility as theyr'e Home Assistant configurations
  // that we should not mess with

  // Normalize search to array format
  config.search = getSearchEntryArray(config.search, config.entity_id);
  if (Array.isArray(config.search) && config.search.length === 0) {
    delete config.search;
  }
  // Do NOT delete config.name, even if falsy/null

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
  const maFavoriteControl = getCleanMaFavoriteControl(config.ma_favorite_control);
  if (maFavoriteControl) {
    config.ma_favorite_control = maFavoriteControl;
  } else {
    delete config.ma_favorite_control;
  }

  if (!config.lms_entity_id) delete config.lms_entity_id;
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

  if (config.options?.always_show_power_button === false) {
    delete config.options.always_show_power_button;
  }
  if (config.options?.show_volume_step_buttons === false) {
    delete config.options.show_volume_step_buttons;
  }
  if (config.options?.use_volume_up_down_for_step_buttons === false) {
    delete config.options.use_volume_up_down_for_step_buttons;
  }
  const footerIcons = getCleanFooterIcons(config.options?.ui?.footer_icons);
  if (footerIcons) {
    config.options = {
      ...config.options,
      ui: {
        ...config.options?.ui,
        footer_icons: footerIcons,
      },
    };
  } else if (config.options?.ui?.footer_icons) {
    delete config.options.ui.footer_icons;
  }
  if (config.options?.ui && Object.keys(config.options.ui).length === 0) {
    delete config.options.ui;
  }
  if (config.options?.use_experimental_lms_media_browser === false) {
    delete config.options.use_experimental_lms_media_browser;
  }

  if (Object.keys(config.options ?? {}).length === 0) {
    delete config.options;
  }

  // Always preserve grid_options and visibility as theyr'e Home Assistant configurations
  // that we should not mess with

  // Normalize search to array format
  config.search = getSearchEntryArray(config.search, config.entity_id);
  if (Array.isArray(config.search) && config.search.length === 0) {
    delete config.search;
  }

  return config;
};
