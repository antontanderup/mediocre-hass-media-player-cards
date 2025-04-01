import { HomeAssistant } from "custom-card-helpers";
import { MediocreMassiveMediaPlayerCard } from "../components";
import { MediocreMassiveMediaPlayerCardConfig } from "../components/MediaPlayerCommon";
import { CardWrapper } from "../utils";

class MediocreMassiveMediaPlayerCardWrapper extends CardWrapper<MediocreMassiveMediaPlayerCardConfig> {
  Card = MediocreMassiveMediaPlayerCard;

  setConfig(config: MediocreMassiveMediaPlayerCardConfig) {
    if (!config.entity_id) {
      throw new Error("You need to define an entity_id");
    }
    this.config = config;
  }

  static getConfigElement() {
    return document.createElement("mediocre-massive-media-player-card-editor");
  }

  static getStubConfig(hass: HomeAssistant) {
    const entities = Object.keys(hass.states);
    const mediaPlayers = entities.filter(
      entity => entity.substr(0, entity.indexOf(".")) === "media_player"
    );

    return {
      entity_id: mediaPlayers[0] ?? "",
      mode: "card",
    };
  }
}

customElements.define(
  "mediocre-massive-media-player-card",
  MediocreMassiveMediaPlayerCardWrapper
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "mediocre-massive-media-player-card",
  name: "Mediocre Massive Media Player Card",
  preview: true,
  description: "A media player card with player grouping support.", // Optional
  documentationURL:
    "https://github.com/antontanderup/mediocre-hass-media-player-cards", // Adds a help link in the frontend card editor
});
