import { HomeAssistant, MediaPlayerEntity } from "@types";
import { MediocreMultiMediaPlayerCardConfig } from "@types";
import { CardWrapper } from "@wrappers";
import { MediocreMultiMediaPlayerCard } from "@components/MediocreMultiMediaPlayerCard";
import { getDidMediaPlayerUpdate } from "@utils";

class MediocreMultiMediaPlayerCardWrapper extends CardWrapper<MediocreMultiMediaPlayerCardConfig> {
  Card = MediocreMultiMediaPlayerCard;
  providePlayerContext = false;

  setConfig(config: MediocreMultiMediaPlayerCardConfig) {
    if (!config.media_players || config.media_players.length === 0) {
      throw new Error("You need to define at least one media player.");
    }
    if (
      config.entity_id &&
      config.media_players.find(
        player => player.entity_id === config.entity_id
      ) === undefined
    ) {
      throw new Error(
        "The entity_id must be one of the defined media players."
      );
    }
    this.config = config;
  }

  shouldUpdate = (
    prevHass: HomeAssistant | null,
    hass: HomeAssistant | null
  ) => {
    if (!hass || !prevHass || !this.config) return true;
    if (!prevHass && hass) return true;
    return this.config.media_players.some(player => {
      const entityId = player.entity_id;
      if (
        getDidMediaPlayerUpdate(
          prevHass.states[entityId] as MediaPlayerEntity,
          hass.states[entityId] as MediaPlayerEntity
        )
      ) {
        return true;
      }
      if (
        player.speaker_group_entity_id &&
        getDidMediaPlayerUpdate(
          prevHass.states[player.speaker_group_entity_id] as MediaPlayerEntity,
          hass.states[player.speaker_group_entity_id] as MediaPlayerEntity
        )
      ) {
        return true;
      }
    });
  };

  static getConfigElement() {
    return document.createElement(
      import.meta.env.VITE_MULTI_MEDIA_PLAYER_CARD_EDITOR
    );
  }

  static getStubConfig(hass: HomeAssistant) {
    const entities = Object.keys(hass.states);
    const mediaPlayers = entities.filter(
      entity => entity.substr(0, entity.indexOf(".")) === "media_player"
    );

    return {
      entity_id: mediaPlayers[0] ?? "",
      media_players: [
        {
          entity_id: mediaPlayers[0] ?? "",
          mode: "card",
        },
      ],
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
  import.meta.env.VITE_MULTI_MEDIA_PLAYER_CARD,
  MediocreMultiMediaPlayerCardWrapper
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: import.meta.env.VITE_MULTI_MEDIA_PLAYER_CARD,
  name: "Mediocre Multi Media Player Card (alpha)",
  preview: true,
  description: "A media player card with player grouping support.",
  documentationURL:
    "https://github.com/antontanderup/mediocre-hass-media-player-cards",
});
