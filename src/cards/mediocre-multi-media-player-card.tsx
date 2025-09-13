import { HomeAssistant, MediaPlayerEntity } from "@types";
import { MediocreMultiMediaPlayerCardConfig } from "@types";
import { CardWrapper } from "@wrappers";
import { getDidMediaPlayerUpdate } from "@utils";
import { MediocreMultiMediaPlayerCard } from "@components/MediocreMultiMediaPlayerCard";

class MediocreMultiMediaPlayerCardWrapper extends CardWrapper<MediocreMultiMediaPlayerCardConfig> {
  Card = MediocreMultiMediaPlayerCard;

  setConfig(config: MediocreMultiMediaPlayerCardConfig) {
    if (!config.media_players || config.media_players.length === 0) {
      throw new Error("You need to define at least one media player");
    }
    this.config = config;
  }

  shouldUpdate = (
    prevHass: HomeAssistant | null,
    hass: HomeAssistant | null
  ) => {
    if (!hass || !prevHass || !this.config) return true;
    if (!prevHass && hass) return true;

    // Check if any of the media players changed
    this.config.media_players.forEach(mediaPlayer => {
      if (
        getDidMediaPlayerUpdate(
          prevHass.states[mediaPlayer.entity_id] as MediaPlayerEntity,
          hass.states[mediaPlayer.entity_id] as MediaPlayerEntity
        )
      ) {
        return true;
      }
    });

    // Check if speaker group entity changed (if configured)
    this.config.speaker_group?.entities.forEach(entity => {
      if (
        getDidMediaPlayerUpdate(
          prevHass.states[
            typeof entity === "string" ? entity : entity.entity
          ] as MediaPlayerEntity,
          hass.states[
            typeof entity === "string" ? entity : entity.entity
          ] as MediaPlayerEntity
        )
      ) {
        return true;
      }
    });

    return false;
  };

  //   static getConfigElement() {
  //     return document.createElement(
  //       import.meta.env.VITE_MUlTI_MEDIA_PLAYER_CARD_EDITOR
  //     );
  //   }

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
