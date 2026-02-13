import { FunctionComponent, render } from "preact";
import { useState } from "preact/hooks";
import { HomeAssistant } from "@types";
import {
  EmotionContextProvider,
  GlanceGuard,
  HassContextProvider,
} from "@components";
import "@types/emotion.d.ts";

export type EditorCardProps<T> = {
  config: T;
  rootElement: HTMLElement;
  hass: HomeAssistant;
};

type EditorUpdaters<Config> = {
  setConfig: (config: Config) => void;
  setHass: (hass: HomeAssistant) => void;
};

function EditorBridge<Config>({
  Component,
  rootElement,
  initialHass,
  initialConfig,
  updaterRef,
}: {
  Component: FunctionComponent<EditorCardProps<Config>>;
  rootElement: HTMLElement;
  initialHass: HomeAssistant;
  initialConfig: Config;
  updaterRef: { current: EditorUpdaters<Config> | null };
}) {
  const [config, setConfig] = useState<Config>(initialConfig);
  const [hass, setHass] = useState<HomeAssistant>(initialHass);

  updaterRef.current = { setConfig, setHass };

  return (
    <EmotionContextProvider rootElement={rootElement}>
      <GlanceGuard>
        <HassContextProvider hass={hass}>
          <Component config={config} hass={hass} rootElement={rootElement} />
        </HassContextProvider>
      </GlanceGuard>
    </EmotionContextProvider>
  );
}

export function defineCardEditor<Config>(
  elementName: string,
  component: FunctionComponent<EditorCardProps<Config>>
): void {
  class EditorElement extends HTMLElement {
    private _config: Config | null = null;
    private _hass: HomeAssistant | null = null;
    private _updaters: EditorUpdaters<Config> | null = null;
    private _mounted = false;

    set hass(hass: HomeAssistant) {
      this._hass = hass;
      this._updaters?.setHass(hass);
    }

    setConfig(config: Config) {
      this._config = config;

      if (!this._mounted) {
        this._mount();
        return;
      }

      this._updaters?.setConfig(config);
    }

    private _mount() {
      if (!this._hass || !this._config) return;

      this._mounted = true;

      const updaterRef = { current: null as EditorUpdaters<Config> | null };

      render(
        <EditorBridge<Config>
          Component={component}
          rootElement={this}
          initialHass={this._hass}
          initialConfig={this._config}
          updaterRef={updaterRef}
        />,
        this
      );

      this._updaters = updaterRef.current;
    }

    disconnectedCallback() {
      render(null, this);
      this._mounted = false;
      this._updaters = null;
    }

    connectedCallback() {
      if (!this._mounted && this._config && this._hass) {
        this._mount();
      }
    }
  }

  customElements.define(elementName, EditorElement);
}
