import { MediocreMassiveMediaPlayerCardEditor } from "../components";
import { MediocreMediaPlayerCardConfig } from "../types";
import { CardEditorWrapper } from "../utils";

class MediocreMassiveMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMassiveMediaPlayerCardEditor;
  extraProps = { isMassive: true, className: undefined };
}

customElements.define(
  "mediocre-massive-media-player-card-editor",
  MediocreMassiveMediaPlayerCardEditorWrapper
);
