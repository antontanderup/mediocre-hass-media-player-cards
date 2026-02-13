import { MediocreMassiveMediaPlayerCardEditor } from "@components";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { defineCardEditor } from "@wrappers";

defineCardEditor<MediocreMassiveMediaPlayerCardConfig>(
  import.meta.env.VITE_MASSIVE_MEDIA_PLAYER_CARD_EDITOR,
  MediocreMassiveMediaPlayerCardEditor
);
