import { HomeAssistant } from "@types";

export function getHass(): HomeAssistant {
  // @ts-expect-error but it's fine. This way we dont have worry about passing/context etc.
  return document.querySelector("home-assistant").hass as HomeAssistant;
}
