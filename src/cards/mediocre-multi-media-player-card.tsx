import { HomeAssistant, MediaPlayerEntity } from "@types";
import { MediocreMultiMediaPlayerCardConfig } from "@types";
import { defineCard } from "@wrappers";
import { MediocreMultiMediaPlayerCard } from "@components/MediocreMultiMediaPlayerCard";
import { getDidMediaPlayerUpdate } from "@utils";

defineCard<MediocreMultiMediaPlayerCardConfig>(
  import.meta.env.VITE_MULTI_MEDIA_PLAYER_CARD,
  {
    component: MediocreMultiMediaPlayerCard,
    providePlayerContext: false,
    validateConfig: config => {
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
    },
    shouldUpdate: (
      prevHass: HomeAssistant | null,
      hass: HomeAssistant | null,
      config: MediocreMultiMediaPlayerCardConfig
    ) => {
      if (!hass || !prevHass) return true;
      return config.media_players.some(player => {
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
            prevHass.states[
              player.speaker_group_entity_id
            ] as MediaPlayerEntity,
            hass.states[player.speaker_group_entity_id] as MediaPlayerEntity
          )
        ) {
          return true;
        }
      });
    },
    editorElementName: import.meta.env.VITE_MULTI_MEDIA_PLAYER_CARD_EDITOR,
    getStubConfig: (hass: HomeAssistant) => {
      const entities = Object.keys(hass.states);
      const mediaPlayers = entities.filter(
        entity => entity.substr(0, entity.indexOf(".")) === "media_player"
      );
      return {
        entity_id: mediaPlayers[0] ?? "",
        mode: "card",
        media_players: [{ entity_id: mediaPlayers[0] ?? "" }],
      };
    },
    getCardSize: () => 2,
    getGridOptions: () => ({ columns: 12, min_columns: 8 }),
    registration: {
      name: "Mediocre Multi Media Player Card",
      description: "A media player card with player grouping support.",
      documentationURL:
        "https://github.com/antontanderup/mediocre-hass-media-player-cards",
    },
  }
);
