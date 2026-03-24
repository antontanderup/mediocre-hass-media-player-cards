import {
  MediocreMassiveMediaPlayerCardConfig,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";

export const getMultiConfigToMediocreMassiveConfig = (
  config: MediocreMultiMediaPlayerCardConfig,
  selectedPlayer: MediocreMultiMediaPlayerCardConfig["media_players"][number],
  mode: "panel" | "card" | "in-card" | "popup"
): MediocreMassiveMediaPlayerCardConfig => {
  const speaker_group = {
    entity_id: selectedPlayer.speaker_group_entity_id,
    entities: config.media_players
      .filter(player => player.can_be_grouped)
      .map(player => {
        if (player.name) {
          return {
            name: player.name,
            entity: player.speaker_group_entity_id ?? player.entity_id,
          };
        } else {
          return player.speaker_group_entity_id ?? player.entity_id;
        }
      }),
  };
  return {
    type: "custom:mediocre-massive-media-player-card",
    entity_id: selectedPlayer.entity_id,
    name: selectedPlayer.name,
    use_art_colors: config.use_art_colors,
    ma_favorite_control: config.ma_favorite_control,
    action: selectedPlayer.action,
    ma_entity_id: selectedPlayer.ma_entity_id,
    ma_favorite_button_entity_id: selectedPlayer.ma_favorite_button_entity_id,
    lms_entity_id: selectedPlayer.lms_entity_id,
    search: selectedPlayer.search,
    media_browser: selectedPlayer.media_browser,
    volume_panel: selectedPlayer.volume_panel,
    volume_trailing_button_custom_button:
      selectedPlayer.volume_trailing_button_custom_button,
    custom_buttons: selectedPlayer.custom_buttons,
    mode: mode,
    speaker_group:
      speaker_group.entities.length > 1 ? speaker_group : undefined,
    options: {
      always_show_footer_more_actions:
        config.options?.always_show_footer_more_actions ?? false,
      ...(config.options?.media_browser_view_icon
        ? { media_browser_view_icon: config.options.media_browser_view_icon }
        : {}),
      ...(config.options?.media_browser_view_title
        ? { media_browser_view_title: config.options.media_browser_view_title }
        : {}),
      ...(config.options?.player_view_icon
        ? { player_view_icon: config.options.player_view_icon }
        : {}),
      ...(config.options?.search_view_title
        ? { search_view_title: config.options.search_view_title }
        : {}),
      ...(config.options?.volume_trailing_button
        ? { volume_trailing_button: config.options.volume_trailing_button }
        : {}),
      show_volume_step_buttons:
        config.options?.show_volume_step_buttons ?? false,
      use_volume_up_down_for_step_buttons:
        config.options?.use_volume_up_down_for_step_buttons ?? false,
      use_experimental_lms_media_browser:
        config.options?.use_experimental_lms_media_browser ?? false,
    },
  };
};
