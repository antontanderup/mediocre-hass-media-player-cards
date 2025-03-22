import {
  MediocreMediaPlayerCardConfig,
  MediocreMediaPlayerCardEditor,
} from "../components/MediaPlayerCommon";
import { CardEditorWrapper } from "../utils";

class MediocreMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMediaPlayerCardEditor;
}

customElements.define(
  "mediocre-media-player-card-editor",
  MediocreMediaPlayerCardEditorWrapper
);
