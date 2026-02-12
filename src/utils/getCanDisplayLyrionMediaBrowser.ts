import { getHass } from "@utils";

export function getCanDisplayLyrionMediaBrowser() {
  const hass = getHass();
  const services = hass.services;
  return !!services["lyrion_cli"];
}
