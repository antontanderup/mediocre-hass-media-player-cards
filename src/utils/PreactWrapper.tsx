import Preact, { render } from "preact";
import { CardContextProvider } from "../utils";
import { HomeAssistant } from "custom-card-helpers";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

export type GetConfigValid<T> = (
  config: T
) =>
  | { valid: true; errorMessage?: undefined }
  | { valid: false; errorMessage: string };

export class PreactWrapper<T> extends HTMLElement {
  Card: Preact.FunctionComponent = null;
  config: T = null;

  set hass(hass) {
    if (!this.Card) {
      throw new Error("Preact Card is not defined");
    }
    render(
      <CardContextProvider rootElement={this} hass={hass} config={this.config}>
        <this.Card />
      </CardContextProvider>,
      this
    );
  }

  getCardSize() {
    return 1;
  }
}

export type EditorCardProps<T> = {
  config: T;
  updateConfig: (newConfig: T) => void;
  hass: HomeAssistant;
};

export class PreactEditorWrapper<T> extends HTMLElement {
  _config: T = null;
  Card: Preact.FunctionComponent<EditorCardProps<T>> = null;
  _hass: HomeAssistant = null;

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config: T) {
    this._config = config;
    render(
      <CacheProvider
        value={createCache({
          key: "re",
          prepend: true,
          container: this,
          speedy: false,
        })}
      >
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
      </CacheProvider>,
      this
    );
  }
}
