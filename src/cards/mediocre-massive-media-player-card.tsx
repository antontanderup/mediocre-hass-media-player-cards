import { MediocreMassiveMediaPlayerCard } from "../components";
import { MediocreMediaPlayerCardConfig } from "../components/MediaPlayerCommon";
import { CardWrapper } from "../utils";

class MediocreMassiveMediaPlayerCardWrapper extends CardWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMassiveMediaPlayerCard;

  setConfig(config: MediocreMediaPlayerCardConfig) {
    if (!config.entity_id) {
      throw new Error("You need to define an entity_id");
    }
    this.config = config;
  }

  static getConfigElement() {
    return document.createElement("mediocre-media-player-card-editor");
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
  preview: false, // Optional - defaults to false
  description: "A media player card with player grouping support", // Optional
  documentationURL:
    "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card", // Adds a help link in the frontend card editor
});
