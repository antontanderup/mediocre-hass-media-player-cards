import { MediocreMediaPlayerCardEditor } from "../components";
import { MediocreMediaPlayerCardConfig } from "../types";
import { CardEditorWrapper } from "../utils";

class MediocreMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMediaPlayerCardEditor;
}

customElements.define(
  "mediocre-media-player-card-editor",
  MediocreMediaPlayerCardEditorWrapper
);
