import { HomeAssistant, MediaPlayerEntity } from "@types";
import {
  MediocreMediaPlayerCard,
  MediocreMediaPlayerCardProps,
} from "@components";
import { MediocreMediaPlayerCardConfig } from "@types";
import { CardWrapper } from "@wrappers";
import { FC } from "preact/compat";
import { getDidMediaPlayerUpdate } from "@utils";

class MediocreMediaPlayerCardWrapper extends CardWrapper<MediocreMediaPlayerCardConfig> {
  Card: FC<MediocreMediaPlayerCardProps> = MediocreMediaPlayerCard;

  setConfig(config: MediocreMediaPlayerCardConfig) {
    if (!config.entity_id) {
      throw new Error("You need to define an entity_id");
    }
    this.config = config;
  }

  shouldUpdate = (
    prevHass: HomeAssistant | null,
    hass: HomeAssistant | null
  ) => {
    if (!hass || !prevHass || !this.config) return true;
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
            prevHass.states[
              typeof entity === "string" ? entity : entity.entity
            ] as MediaPlayerEntity,
            hass.states[
              typeof entity === "string" ? entity : entity.entity
            ] as MediaPlayerEntity,
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
