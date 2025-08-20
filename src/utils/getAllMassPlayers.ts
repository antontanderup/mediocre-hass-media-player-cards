import { getHass } from "./getHass";
import { getIsMassPlayer } from "./getIsMassPlayer";
import type { MediaPlayerEntity } from "../types/mediaPlayerEntity";

/**
 * Returns all media player entities that are Music Assistant (MA) players.
 */
export function getAllMassPlayers(): MediaPlayerEntity[] {
  const hass = getHass();
  if (!hass) return [];
  return Object.values(hass.states).filter(
    (entity): entity is MediaPlayerEntity =>
      entity.entity_id?.startsWith("media_player.") &&
      getIsMassPlayer(entity as MediaPlayerEntity)
  );
}
