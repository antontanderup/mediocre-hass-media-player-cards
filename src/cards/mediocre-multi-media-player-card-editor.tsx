import { MediocreMultiMediaPlayerCardEditor } from "@components";
import { MediocreMultiMediaPlayerCardConfig } from "@types";
import { defineCardEditor } from "@wrappers";

defineCardEditor<MediocreMultiMediaPlayerCardConfig>(
  import.meta.env.VITE_MULTI_MEDIA_PLAYER_CARD_EDITOR,
  MediocreMultiMediaPlayerCardEditor
);
