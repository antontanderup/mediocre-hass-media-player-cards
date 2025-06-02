import { FunctionComponent, render } from "preact";
import { HomeAssistant } from "@types";
import { EmotionContextProvider, GlanceGuard } from "@components";

export type EditorCardProps<T> = {
  config: T;
  rootElement: HTMLElement;
  hass: HomeAssistant;
};

export class CardEditorWrapper<T> extends HTMLElement {
  _config: T | null = null;
  Card: FunctionComponent<EditorCardProps<T>> | null = null;
  extraProps: { [key: string]: unknown } = {};
  _hass: HomeAssistant | null = null;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  setConfig(config: T) {
    this._config = config;
    if (!this._hass || !this.Card) return;
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
