import {
  MediocreMediaPlayerCardConfig,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";

export const getMediocreLegacyConfigToMediocreMultiConfig = (
  config: MediocreMediaPlayerCardConfig
): MediocreMultiMediaPlayerCardConfig => {
  const media_players = [
    {
      action: config.action,
      name: config.name,
      entity_id: config.entity_id,
      ma_entity_id: config.ma_entity_id,
      ma_favorite_button_entity_id: config.ma_favorite_button_entity_id,
      speaker_group_entity_id: config.speaker_group?.entity_id,
      lms_entity_id: config.lms_entity_id,
      search: config.search,
      media_browser: config.media_browser,
      custom_buttons: config.custom_buttons,
      can_be_grouped: true,
    },
    ...((
      config.speaker_group?.entities.map(entity => {
        const entity_id = typeof entity === "string" ? entity : entity.entity;
        if (
          entity_id === config.entity_id ||
          entity_id === config.speaker_group?.entity_id
        ) {
          return null; // skip main entity if it's also listed in the group
        }
        if (typeof entity === "string") {
          return {
            entity_id: entity,
            can_be_grouped: true,
          };
        } else {
          return {
            entity_id: entity.entity,
            name: entity.name,
            can_be_grouped: true,
          };
        }
      }) ?? []
    ).filter(Boolean) as MediocreMultiMediaPlayerCardConfig["media_players"]),
  ];

  return {
    type: "custom:mediocre-multi-media-player-card",
    use_art_colors: config.use_art_colors ?? false,
    disable_player_focus_switching: true,
    entity_id: config.entity_id,
    tap_opens_popup: config.tap_opens_popup ?? false,
    size: "compact",
    options: {
      show_volume_step_buttons:
        config.options?.show_volume_step_buttons ?? false,
      use_volume_up_down_for_step_buttons:
        config.options?.use_volume_up_down_for_step_buttons ?? false,
      always_show_custom_buttons:
        config.options?.always_show_custom_buttons ?? false,
      always_show_power_button:
        config.options?.always_show_power_button ?? false,
      hide_when_group_child: config.options?.hide_when_group_child ?? false,
      hide_when_off: config.options?.hide_when_off ?? false,
    },
    media_players,
  };
};
