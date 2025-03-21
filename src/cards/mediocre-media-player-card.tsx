import { MediocreMediaPlayerCard } from "../components";
import { MediocreMediaPlayerCardConfig } from "../components/MediaPlayerCommon";
import { PreactWrapper } from "../utils";

class MediocreMediaPlayerCardWrapper extends PreactWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMediaPlayerCard;

  setConfig(config: MediocreMediaPlayerCardConfig) {
    if (!config.entity_id) {
      throw new Error("You need to define an entity_id");
    }
    this.config = config;
  }

  static getConfigElement() {
    return document.createElement("mediocre-media-player-card-editor");
  }

  getCardSize() {
    return 2;
  }

  getGridOptions() {
    return {
      columns: 12,
      min_columns: 8,
    };
  }
}

customElements.define(
  "mediocre-media-player-card",
  MediocreMediaPlayerCardWrapper
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "mediocre-media-player-card",
  name: "Mediocre Media Player Card",
  preview: false, // Optional - defaults to false
  description: "A media player card with player grouping support", // Optional
  documentationURL:
    "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card", // Adds a help link in the frontend card editor
});
