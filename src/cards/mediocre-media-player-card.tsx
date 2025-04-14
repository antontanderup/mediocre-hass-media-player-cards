import { HomeAssistant } from "custom-card-helpers";
import { MediocreMediaPlayerCard } from "@components";
import { MediocreMediaPlayerCardConfig } from "@types";
import { CardWrapper } from "@wrappers";
import { getDidMediaPlayerUpdate } from "@utils";

class MediocreMediaPlayerCardWrapper extends CardWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMediaPlayerCard;

  setConfig(config: MediocreMediaPlayerCardConfig) {
    if (!config.entity_id) {
      throw new Error("You need to define an entity_id");
    }
    this.config = config;
  }

  shouldUpdate = (prevHass: HomeAssistant, hass: HomeAssistant) => {
    if (!prevHass && hass) return true;

    // Check if main entity changed
    if (
      getDidMediaPlayerUpdate(
        prevHass.states[this.config.entity_id],
        hass.states[this.config.entity_id]
      )
    ) {
      return true;
    }

    // Check if speaker group entity changed (if configured)
    if (
      this.config.speaker_group?.entity_id &&
      getDidMediaPlayerUpdate(
        prevHass.states[this.config.speaker_group.entity_id],
        hass.states[this.config.speaker_group.entity_id]
      )
    ) {
      return true;
    }

    if (this.config.speaker_group?.entities) {
      for (const entity of this.config.speaker_group.entities) {
        if (
          getDidMediaPlayerUpdate(
            prevHass.states[entity],
            hass.states[entity],
            true
          )
        ) {
          return true;
        }
      }
    }

    return false;
  };

  static getConfigElement() {
    return document.createElement(
      import.meta.env.VITE_MEDIA_PLAYER_CARD_EDITOR
    );
  }

  static getStubConfig(hass: HomeAssistant) {
    const entities = Object.keys(hass.states);
    const mediaPlayers = entities.filter(
      entity => entity.substr(0, entity.indexOf(".")) === "media_player"
    );

    return {
      entity_id: mediaPlayers[0] ?? "",
    };
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
  import.meta.env.VITE_MEDIA_PLAYER_CARD,
  MediocreMediaPlayerCardWrapper
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: import.meta.env.VITE_MEDIA_PLAYER_CARD,
  name: "Mediocre Media Player Card",
  preview: true,
  description: "A media player card with player grouping support.",
  documentationURL:
    "https://github.com/antontanderup/mediocre-hass-media-player-cards",
});
