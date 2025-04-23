import { getHass } from "./getHass";

/**
 * Sets the volume for the main speaker and optionally syncs relative volume changes
 * across all grouped speakers.
 *
 * @param mainEntityId - The entity ID of the main speaker
 * @param newVolume - The new volume level to set (0-1)
 * @param syncGroup - Whether to sync volume changes to grouped speakers
 */
export const setVolume = (
  mainEntityId: string,
  newVolume: number,
  syncGroup: boolean = false
): void => {
  const hass = getHass();
  const mainEntity = hass.states[mainEntityId];
  if (!mainEntity) return;

  // Set volume for the main entity
  hass.callService("media_player", "volume_set", {
    entity_id: mainEntityId,
    volume_level: newVolume,
  });

  // Optionally sync volume changes to grouped speakers
  if (syncGroup && mainEntity.attributes.group_members?.length > 0) {
    const oldMainVolume = mainEntity.attributes.volume_level || 0;
    const volumeRatio = oldMainVolume > 0 ? newVolume / oldMainVolume : 1;

    // Skip the main speaker (first in array) and update others with relative change
    mainEntity.attributes.group_members
      .slice(1)
      .forEach((speakerId: string) => {
        const speaker = hass.states[speakerId];
        if (!speaker) return;

        const speakerVolume = speaker.attributes.volume_level || 0;
        // Apply relative volume change, keeping within 0-1 bounds
        const newSpeakerVolume = Math.min(
          Math.max(speakerVolume * volumeRatio, 0),
          1
        );

        hass.callService("media_player", "volume_set", {
          entity_id: speakerId,
          volume_level: newSpeakerVolume,
        });
      });
  }
};
