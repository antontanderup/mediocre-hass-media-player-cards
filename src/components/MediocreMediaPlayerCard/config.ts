export type MediocreMediaPlayerCardConfig = {
  entity_id: string;
  speaker_group?: {
    entity_id?: string; // entity_id of the main speaker incase it's different from the entity_id of the media player
    entities: string[]; // entity_ids of the speakers that can be grouped with the main speaker
  };
};
