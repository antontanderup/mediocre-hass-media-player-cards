import { HassEntity } from "home-assistant-js-websocket";

export const getDidMediaPlayerUpdate = (
  prevEntity: HassEntity,
  entity: HassEntity,
  isGroupMember?: boolean
) => {
  // List of keys we want to ignore in comparison
  const compareKeys = isGroupMember
    ? [
        "state",
        "attributes.volume_level",
        "attributes.is_volume_muted",
        "attributes.group_members",
      ]
    : [
        "state",
        "attributes.media_duration",
        "attributes.media_title",
        "attributes.media_artist",
        "attributes.media_album_name",
        "attributes.icon",
        "attributes.friendly_name",
        "attributes.entity_picture",
        "attributes.volume_level",
        "attributes.is_volume_muted",
        "attributes.shuffle",
        "attributes.repeat",
        "attributes.supported_features",
        "attributes.group_members",
      ];

  // Helper function to get nested property values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (obj: any, path: string) => {
    const parts = path.split(".");
    return parts.reduce(
      (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
      obj
    );
  };

  // Helper function to compare arrays more efficiently
  const arraysEqual = (a: unknown[], b: unknown[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  // Check if any of the specified keys have different values between the entities
  for (const key of compareKeys) {
    const prevValue = getNestedValue(prevEntity, key);
    const currentValue = getNestedValue(entity, key);

    // Special handling for arrays (like group_members) - compare directly
    if (Array.isArray(prevValue) && Array.isArray(currentValue)) {
      if (!arraysEqual(prevValue, currentValue)) {
        return true;
      }
    }
    // Standard comparison for other types
    else if (prevValue !== currentValue) {
      return true;
    }
  }

  // No differences found in the specified keys
  return false;
};
