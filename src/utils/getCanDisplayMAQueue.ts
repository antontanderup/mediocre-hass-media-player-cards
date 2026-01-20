import { getHass } from "@utils";

export function getCanDisplayMAQueue() {
  const hass = getHass();
  const services = hass.services;
  return !!services["mass_queue"];
}
