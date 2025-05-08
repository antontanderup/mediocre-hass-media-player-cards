import { InteractionConfig } from "@types";

export type CommonMediocreMediaPlayerCardConfig = {
  entity_id: string;
  use_art_colors?: boolean;
  action?: InteractionConfig;
  speaker_group?: {
    entity_id?: string; // entity_id of the main speaker incase it's different from the entity_id of the media player
    entities: string[]; // entity_ids of the speakers that can be grouped with the main speaker
  };
  custom_buttons?: (InteractionConfig & {
    icon: string;
    name: string;
  })[];
  ma_entity_id?: string; // MusicAssistant entity_id (adds MA specific features (currently search))
};

export type MediocreMediaPlayerCardConfig =
  CommonMediocreMediaPlayerCardConfig & {
    tap_opens_popup?: boolean;
  };

export type MediocreMassiveMediaPlayerCardConfig =
  CommonMediocreMediaPlayerCardConfig & {
    mode: "panel" | "card" | "in-card" | "popup"; // don't document popup as it only for internal use
  };
