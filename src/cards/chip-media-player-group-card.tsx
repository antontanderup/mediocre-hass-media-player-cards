import {
  MediocreChipMediaPlayerGroupCard,
  MediocreChipMediaPlayerGroupCardConfig,
} from "../components";
import { CardWrapper } from "../wrappers";

class MediocreChipMediaPlayerGroupCardWrapper extends CardWrapper<MediocreChipMediaPlayerGroupCardConfig> {
  Card = MediocreChipMediaPlayerGroupCard;

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
