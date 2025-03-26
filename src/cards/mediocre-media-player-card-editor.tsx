import {
  MediocreMediaPlayerCardConfig,
  MediocreMediaPlayerCardEditor,
} from "../components/MediaPlayerCommon";
import { CardEditorWrapper } from "../utils";

class MediocreMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMediaPlayerCardEditor;
}

class MediocreMassiveMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMediaPlayerCardEditor;
  extraProps = { isMassive: true };
}

customElements.define(
  "mediocre-massive-media-player-card-editor",
  MediocreMassiveMediaPlayerCardEditorWrapper
);

customElements.define(
  "mediocre-media-player-card-editor",
  MediocreMediaPlayerCardEditorWrapper
);
