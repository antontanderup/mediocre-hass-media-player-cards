import { MediocreMassiveMediaPlayerCardEditor } from "../components";
import { MediocreMediaPlayerCardConfig } from "../types";
import { CardEditorWrapper } from "../utils";

class MediocreMassiveMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMassiveMediaPlayerCardEditor;
  extraProps = { isMassive: true, className: undefined };
}

customElements.define(
  import.meta.env.VITE_MASSIVE_MEDIA_PLAYER_CARD_EDITOR,
  MediocreMassiveMediaPlayerCardEditorWrapper
);
