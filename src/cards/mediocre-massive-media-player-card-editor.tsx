import { MediocreMassiveMediaPlayerCardEditor } from "@components";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { CardEditorWrapper } from "@wrappers";

class MediocreMassiveMediaPlayerCardEditorWrapper extends CardEditorWrapper<MediocreMassiveMediaPlayerCardConfig> {
  Card = MediocreMassiveMediaPlayerCardEditor;
  extraProps = { isMassive: true, className: undefined };
}

customElements.define(
  import.meta.env.VITE_MASSIVE_MEDIA_PLAYER_CARD_EDITOR,
  MediocreMassiveMediaPlayerCardEditorWrapper
);
