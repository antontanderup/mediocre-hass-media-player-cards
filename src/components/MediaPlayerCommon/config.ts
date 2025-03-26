import { InteractionConfig } from "../../types/actionTypes";

export type MediocreMediaPlayerCardConfig = {
  entity_id: string;
  action?: InteractionConfig;
  speaker_group?: {
    entity_id?: string; // entity_id of the main speaker incase it's different from the entity_id of the media player
    entities: string[]; // entity_ids of the speakers that can be grouped with the main speaker
  };
  custom_buttons?: (InteractionConfig & {
    icon: string;
    name: string;
  })[];
};

export type MediocreMassiveMediaPlayerCardConfig =
  MediocreMediaPlayerCardConfig & {
    mode: "panel" | "card" | "in-card";
  };
