import { getHass } from "@utils/getHass";

/**
 * Transfers the Music Assistant queue from one entity to another.
 * @param originEntityId The entity ID to transfer from.
 * @param targetEntityId The entity ID to transfer to.
 * @returns A promise that resolves when the transfer is complete.
 */
export async function transferMaQueue(
  originEntityId: string,
  targetEntityId: string
): Promise<void> {
  const hass = getHass();
  if (!hass) throw new Error("hass object not available");
  await hass.callService(
    "music_assistant",
    "transfer_queue",
    { source_player: originEntityId },
    { entity_id: targetEntityId }
  );
}
