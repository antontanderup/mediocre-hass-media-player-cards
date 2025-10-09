import {
  MediocreChipMediaPlayerGroupCard,
  MediocreChipMediaPlayerGroupCardConfig,
} from "@components";
import { HomeAssistant, MediaPlayerEntity } from "@types";
import { getDidMediaPlayerUpdate } from "@utils";
import { CardWrapper } from "@wrappers";

class MediocreChipMediaPlayerGroupCardWrapper extends CardWrapper<MediocreChipMediaPlayerGroupCardConfig> {
  Card = MediocreChipMediaPlayerGroupCard;

  shouldUpdate = (
    prevHass: HomeAssistant | null,
    hass: HomeAssistant | null
  ) => {
    if (!hass || !prevHass || !this.config) return true;
    if (!prevHass && hass) return true;

    return getDidMediaPlayerUpdate(
      prevHass.states[this.config.entity_id] as MediaPlayerEntity,
      hass.states[this.config.entity_id] as MediaPlayerEntity
    );
  };

  setConfig(config: MediocreChipMediaPlayerGroupCardConfig) {
    if (!config.entity_id) {
      throw new Error("You need to define an entity_id");
    }
    if (!config.entities) {
      throw new Error("You need to define entities");
    }
    this.config = config;
  }

  getCardSize() {
    return 1;
  }

  getLayoutOptions() {
    return {
      grid_rows: 1,
      grid_columns: 6,
      grid_min_rows: 1,
      grid_max_rows: 1,
    };
  }
}

customElements.define(
  import.meta.env.VITE_CHIP_MEDIA_PLAYER_GROUP_CARD,
  MediocreChipMediaPlayerGroupCardWrapper
);
