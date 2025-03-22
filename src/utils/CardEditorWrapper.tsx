import Preact, { render } from "preact";
import { HomeAssistant } from "custom-card-helpers";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { EmotionContextProvider } from "./EmotionContextProvider";

export type EditorCardProps<T> = {
  config: T;
  updateConfig: (newConfig: T) => void;
  hass: HomeAssistant;
};

export class CardEditorWrapper<T> extends HTMLElement {
  _config: T = null;
  Card: Preact.FunctionComponent<EditorCardProps<T>> = null;
  _hass: HomeAssistant = null;

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config: T) {
    this._config = config;
    render(
      <EmotionContextProvider rootElement={this}>
        <this.Card
          config={this._config}
          hass={this._hass}
          updateConfig={(newConfig: T) => {
            const event = new Event("config-changed", {
              bubbles: true,
              composed: true,
            });
            // @ts-ignore
            event.detail = { config: newConfig };
            this.dispatchEvent(event);
          }}
        />
      </EmotionContextProvider>,
      this
    );
  }
}
