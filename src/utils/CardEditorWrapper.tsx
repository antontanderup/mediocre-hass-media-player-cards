import Preact, { render } from "preact";
import { HomeAssistant } from "custom-card-helpers";
import { EmotionContextProvider } from "./EmotionContextProvider";
import { GlanceGuard } from "./GlanceGuard";

export type EditorCardProps<T> = {
  config: T;
  rootElement: HTMLElement;
  hass: HomeAssistant;
};

export class CardEditorWrapper<T> extends HTMLElement {
  _config: T = null;
  Card: Preact.FunctionComponent<EditorCardProps<T>> = null;
  extraProps: { [key: string]: any } = {};
  _hass: HomeAssistant = null;

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config: T) {
    this._config = config;
    render(
      <EmotionContextProvider rootElement={this}>
        <GlanceGuard>
          <this.Card
            config={this._config}
            hass={this._hass}
            rootElement={this}
            {...this.extraProps}
          />
        </GlanceGuard>
      </EmotionContextProvider>,
      this
    );
  }
}
