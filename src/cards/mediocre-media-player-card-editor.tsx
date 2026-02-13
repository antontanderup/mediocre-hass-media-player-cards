import { MediocreMediaPlayerCardEditor } from "@components";
import { MediocreMediaPlayerCardConfig } from "@types";
import { defineCardEditor } from "@wrappers";

defineCardEditor<MediocreMediaPlayerCardConfig>(
  import.meta.env.VITE_MEDIA_PLAYER_CARD_EDITOR,
  MediocreMediaPlayerCardEditor
);
