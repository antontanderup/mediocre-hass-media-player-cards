import type { MediaPlayerEntity } from "@types";
import { getHass } from "@utils";

/**
 * Determines if a player is a Music Assistant (MA) player.
 * A MA player has the 'mass_player_type' attribute.
 * @param entity The MediaPlayerEntity object.
 * @returns True if the player is a MA player, false otherwise.
 */

export function getIsMassPlayer(entity: Partial<MediaPlayerEntity>): boolean {
  // If the entity has a mass_player_type attribute, it is a MA player
  if (typeof entity?.attributes?.mass_player_type !== "undefined") return true;

  // If the entity has an active_child (UMP), check if that child is a MA player
  if (typeof entity?.attributes?.active_child !== "undefined") {
    const hass = getHass()
    const activeChild = hass.states[entity.attributes.active_child] as MediaPlayerEntity | undefined;
    if (!activeChild) return false;
    return getIsMassPlayer(activeChild);
  }

  return false;
}
