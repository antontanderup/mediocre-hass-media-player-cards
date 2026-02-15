import {
  MediocreMassiveMediaPlayerCardConfig,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";

export const getMultiConfigToMediocreMassiveConfig = (
  config: MediocreMultiMediaPlayerCardConfig,
  selectedPlayer: MediocreMultiMediaPlayerCardConfig["media_players"][number],
  mode: "panel" | "card" | "in-card" | "popup" | "multi"
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
    action: selectedPlayer.action,
    ma_entity_id: selectedPlayer.ma_entity_id,
    lms_entity_id: selectedPlayer.lms_entity_id,
    search: selectedPlayer.search,
    media_browser: selectedPlayer.media_browser,
    custom_buttons: selectedPlayer.custom_buttons,
    mode: mode,
    speaker_group:
      speaker_group.entities.length > 1 ? speaker_group : undefined,
    options: {
      show_volume_step_buttons:
        config.options?.show_volume_step_buttons ?? false,
      use_volume_up_down_for_step_buttons:
        config.options?.use_volume_up_down_for_step_buttons ?? false,
    },
  };
};
