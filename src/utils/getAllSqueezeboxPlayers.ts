import { getHass } from "@utils";

export function getAllSqueezeboxPlayers() {
  const hass = getHass();
  const entities = hass.entities;
  const squeezeboxPlayers = Object.keys(entities).filter(
    entityId =>
      entityId.startsWith("media_player.") &&
      entities[entityId].platform === "squeezebox"
  );
  return squeezeboxPlayers.map(entityId => hass.states[entityId]);
}
