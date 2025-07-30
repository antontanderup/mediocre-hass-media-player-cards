import type { MediaPlayerEntity } from "@types";

/**
 * Determines if a player is a Music Assistant (MA) player.
 * A MA player has the 'mass_player_type' attribute.
 * @param entity The MediaPlayerEntity object.
 * @returns True if the player is a MA player, false otherwise.
 */
export function getIsMassPlayer(entity: MediaPlayerEntity): boolean {
    return typeof entity.attributes.mass_player_type !== "undefined";
}
