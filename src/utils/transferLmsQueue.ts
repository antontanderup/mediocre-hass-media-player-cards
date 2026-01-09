import { getHass } from "./getHass";

export async function transferLmsQueue(
  fromEntityId: string,
  toEntityId: string
) {
  const hass = getHass();

  await hass.callService("media_player", "join", {
    entity_id: fromEntityId,
    group_members: [toEntityId],
  });

  await hass.callService("media_player", "turn_off", {
    entity_id: fromEntityId,
  });

  await hass.callService("media_player", "turn_on", {
    entity_id: toEntityId,
  });

  await hass.callService("media_player", "media_play", {
    entity_id: toEntityId,
  });

  await hass.callService("media_player", "unjoin", {
    entity_id: fromEntityId,
  });
}
