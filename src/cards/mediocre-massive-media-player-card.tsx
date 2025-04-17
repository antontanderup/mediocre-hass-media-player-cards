import { HomeAssistant, MediaPlayerEntity } from "@types";
import { MediocreMassiveMediaPlayerCard } from "@components";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { CardWrapper } from "@wrappers";
import { FC } from "preact/compat";
import { getDidMediaPlayerUpdate } from "@utils";

class MediocreMassiveMediaPlayerCardWrapper extends CardWrapper<MediocreMassiveMediaPlayerCardConfig> {
  Card: FC<{ className?: string }> = MediocreMassiveMediaPlayerCard;

  shouldUpdate = (prevHass: HomeAssistant, hass: HomeAssistant) => {
    if (!prevHass && hass) return true;

    // Check if main entity changed
    if (
      getDidMediaPlayerUpdate(
        prevHass.states[this.config.entity_id] as MediaPlayerEntity,
        hass.states[this.config.entity_id] as MediaPlayerEntity
      )
    ) {
      return true;
    }

    // Check if speaker group entity changed (if configured)
    if (
      this.config.speaker_group?.entity_id &&
      getDidMediaPlayerUpdate(
        prevHass.states[
          this.config.speaker_group.entity_id
        ] as MediaPlayerEntity,
        hass.states[this.config.speaker_group.entity_id] as MediaPlayerEntity
      )
    ) {
      return true;
    }

    if (this.config.speaker_group?.entities) {
      for (const entity of this.config.speaker_group.entities) {
        if (
          getDidMediaPlayerUpdate(
            prevHass.states[entity] as MediaPlayerEntity,
            hass.states[entity] as MediaPlayerEntity,
            true
          )
        ) {
          return true;
        }
      }
    }

    return false;
  };

  setConfig(config: MediocreMassiveMediaPlayerCardConfig) {
    if (!config.entity_id) {
      throw new Error("You need to define an entity_id");
    }
    this.config = config;
  }

  static getConfigElement() {
    return document.createElement(
      import.meta.env.VITE_MASSIVE_MEDIA_PLAYER_CARD_EDITOR
    );
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
  import.meta.env.VITE_MASSIVE_MEDIA_PLAYER_CARD,
  MediocreMassiveMediaPlayerCardWrapper
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: import.meta.env.VITE_MASSIVE_MEDIA_PLAYER_CARD,
  name: "Mediocre Massive Media Player Card",
  preview: true,
  description: "A media player card with player grouping support.", // Optional
  documentationURL:
    "https://github.com/antontanderup/mediocre-hass-media-player-cards", // Adds a help link in the frontend card editor
});
