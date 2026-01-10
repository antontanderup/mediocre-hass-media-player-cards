import type { MediaPlayerEntity } from "@types";

/**
 * Determines if a player is a LMS player.
 * @param entity The MediaPlayerEntity object.
 * @param lmsEntityId The LMS entity ID to check against.
 * @returns True if the player is a LMS player, false otherwise.
 */

export function getIsLmsPlayer(
  entity: Partial<MediaPlayerEntity>,
  lmsEntityId: string
): boolean {
  if (entity.entity_id === lmsEntityId) return true;

  // If the entity has an active_child (UMP), check if that child is an LMS player
  if (typeof entity?.attributes?.active_child !== "undefined") {
    return entity.attributes.active_child === lmsEntityId;
  }

  return false;
}
