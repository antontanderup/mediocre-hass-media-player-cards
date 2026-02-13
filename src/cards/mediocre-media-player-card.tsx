import { HomeAssistant, MediaPlayerEntity } from "@types";
import { MediocreMediaPlayerCard } from "@components";
import { MediocreMediaPlayerCardConfig } from "@types";
import { defineCard } from "@wrappers";
import { getDidMediaPlayerUpdate } from "@utils";

defineCard<MediocreMediaPlayerCardConfig>(
  import.meta.env.VITE_MEDIA_PLAYER_CARD,
  {
    component: MediocreMediaPlayerCard,
    validateConfig: config => {
      if (!config.entity_id) {
        throw new Error("You need to define an entity_id");
      }
    },
    shouldUpdate: (
      prevHass: HomeAssistant | null,
      hass: HomeAssistant | null,
      config: MediocreMediaPlayerCardConfig
    ) => {
      if (!hass || !prevHass) return true;

      if (
        getDidMediaPlayerUpdate(
          prevHass.states[config.entity_id] as MediaPlayerEntity,
          hass.states[config.entity_id] as MediaPlayerEntity
        )
      ) {
        return true;
      }

      if (
        config.speaker_group?.entity_id &&
        getDidMediaPlayerUpdate(
          prevHass.states[config.speaker_group.entity_id] as MediaPlayerEntity,
          hass.states[config.speaker_group.entity_id] as MediaPlayerEntity
        )
      ) {
        return true;
      }

      if (config.speaker_group?.entities) {
        for (const entity of config.speaker_group.entities) {
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
    },
    editorElementName: import.meta.env.VITE_MEDIA_PLAYER_CARD_EDITOR,
    getStubConfig: (hass: HomeAssistant) => {
      const entities = Object.keys(hass.states);
      const mediaPlayers = entities.filter(
        entity => entity.substr(0, entity.indexOf(".")) === "media_player"
      );
      return { entity_id: mediaPlayers[0] ?? "" };
    },
    getCardSize: () => 2,
    getGridOptions: () => ({ columns: 12, min_columns: 8 }),
    registration: {
      name: "Mediocre Media Player Card",
      description: "A media player card with player grouping support.",
      documentationURL:
        "https://github.com/antontanderup/mediocre-hass-media-player-cards",
    },
  }
);
