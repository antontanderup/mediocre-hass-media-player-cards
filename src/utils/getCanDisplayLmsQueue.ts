import { getHass } from "@utils";

export function getCanDisplayLmsQueue() {
  const hass = getHass();
  const services = hass.services;
  return !!services["lyrion_cli"];
}
