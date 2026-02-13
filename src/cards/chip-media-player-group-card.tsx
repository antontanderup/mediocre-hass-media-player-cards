import {
  MediocreChipMediaPlayerGroupCard,
  MediocreChipMediaPlayerGroupCardConfig,
} from "@components";
import { HomeAssistant, MediaPlayerEntity } from "@types";
import { getDidMediaPlayerUpdate } from "@utils";
import { defineCard } from "@wrappers";

defineCard<MediocreChipMediaPlayerGroupCardConfig>(
  import.meta.env.VITE_CHIP_MEDIA_PLAYER_GROUP_CARD,
  {
    component: MediocreChipMediaPlayerGroupCard,
    validateConfig: config => {
      if (!config.entity_id) {
        throw new Error("You need to define an entity_id");
      }
      if (!config.entities) {
        throw new Error("You need to define entities");
      }
    },
    shouldUpdate: (
      prevHass: HomeAssistant | null,
      hass: HomeAssistant | null,
      config: MediocreChipMediaPlayerGroupCardConfig
    ) => {
      if (!hass || !prevHass) return true;
      return getDidMediaPlayerUpdate(
        prevHass.states[config.entity_id] as MediaPlayerEntity,
        hass.states[config.entity_id] as MediaPlayerEntity
      );
    },
    getLayoutOptions: () => ({
      grid_rows: 1,
      grid_columns: 6,
      grid_min_rows: 1,
      grid_max_rows: 1,
    }),
  }
);
