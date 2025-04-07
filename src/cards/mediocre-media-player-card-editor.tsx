import { MediocreMediaPlayerCardEditor } from "../components";
import { MediocreMediaPlayerCardConfig } from "../types";
import { CardEditorWrapper } from "../utils";

class MediocreMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMediaPlayerCardEditor;
}

customElements.define(
  import.meta.env.VITE_MEDIA_PLAYER_CARD_EDITOR,
  MediocreMediaPlayerCardEditorWrapper
);
