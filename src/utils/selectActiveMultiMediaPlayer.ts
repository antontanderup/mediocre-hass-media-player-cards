import {
  HomeAssistant,
  MediaPlayerEntity,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";

/**
 * Selects the most appropriate player from the config and hass state.
 * Returns the player that is currently playing or paused and is the group leader, or falls back to config.entity_id.
 */
export function selectActiveMultiMediaPlayer(
  hass: HomeAssistant,
  config: MediocreMultiMediaPlayerCardConfig,
  selectedMediaPlayer?: MediocreMultiMediaPlayer
): MediocreMultiMediaPlayer | undefined {
  if (config.disable_player_focus_switching) {
    return (
      selectedMediaPlayer ??
      config.media_players.find(player => player.entity_id === config.entity_id)
    );
  }

  let player =
    selectedMediaPlayer ??
    config.media_players.find(player => player.entity_id === config.entity_id);

  const playerState = hass.states[player?.entity_id ?? config.entity_id]?.state;
  if (
    player &&
    getIsActivePlayer(
      playerState,
      config.options?.player_is_active_when ?? "playing"
    )
  ) {
    const groupState =
      hass.states[player?.speaker_group_entity_id || player.entity_id];
    const members = groupState?.attributes?.group_members;
    if (!members?.length || members[0] === groupState.entity_id) {
      return player;
    }
  }

  config.media_players.forEach(p => {
    const state = hass.states[p.entity_id] as MediaPlayerEntity;
    if (
      getIsActivePlayer(
        state.state,
        config.options?.player_is_active_when ?? "playing"
      )
    ) {
      const groupState = hass.states[p.speaker_group_entity_id || p.entity_id];
      const members = groupState?.attributes?.group_members;
      if (!members?.length || members[0] === groupState.entity_id) {
        player = p;
      }
    }
  });

  return player;
}

const getIsActivePlayer = (
  state: string,
  activeLogic: "playing" | "playing_or_paused"
) => {
  if (activeLogic === "playing") {
    return state === "playing";
  } else {
    return state === "playing" || state === "paused";
  }
};
