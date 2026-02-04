import { MediaPlayerEntity } from "@types";
import { getHass } from "./getHass";
import { getIsMassPlayer } from "./getIsMassPlayer";

/**
 * Returns true if we are confident that the user wants to use Mass Player features.
 */
export function getHasMassFeatures(
  entity_id: string,
  ma_entity_id?: string | null
): boolean {
  if (entity_id === ma_entity_id) {
    return true;
  }

  const entity = getHass().states[entity_id] as MediaPlayerEntity | undefined;

  if (!entity) return false;

  if (getIsMassPlayer(entity)) {
    return true;
  }

  if (typeof entity.attributes?.active_child !== "undefined") {
    // getIsMassPlayer will check active_child recursively so this is sufficient
    return false;
  }

  if (ma_entity_id) {
    // there is no active_child property so we assume this is not a universal player
    // thus we must trust that the user wants MA features if ma_entity_id is set
    return true;
  }

  return false;
}
