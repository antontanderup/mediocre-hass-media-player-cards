import {
  MediocreChipMediaPlayerGroupCard,
  MediocreChipMediaPlayerGroupCardConfig,
} from "../components";
import { CardWrapper } from "../utils";

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
  "mediocre-chip-media-player-group-card",
  MediocreChipMediaPlayerGroupCardWrapper
);
