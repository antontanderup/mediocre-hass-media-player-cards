import {
  MediocreMassiveMediaPlayerCardEditor,
  MediocreMediaPlayerCardEditor,
} from "../components";
import { MediocreMediaPlayerCardConfig } from "../components/MediaPlayerCommon";
import { CardEditorWrapper } from "../utils";

class MediocreMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMediaPlayerCardEditor;
}

class MediocreMassiveMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMassiveMediaPlayerCardEditor;
  extraProps = { isMassive: true, className: undefined };
}

customElements.define(
  "mediocre-massive-media-player-card-editor",
  MediocreMassiveMediaPlayerCardEditorWrapper
);

customElements.define(
  "mediocre-media-player-card-editor",
  MediocreMediaPlayerCardEditorWrapper
);
