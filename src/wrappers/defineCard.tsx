import { FunctionComponent, render } from "preact";
import { useState } from "preact/hooks";
import {
  EmotionContextProvider,
  CardContextProvider,
  HassContextProvider,
} from "@components";
import "@types/emotion.d.ts";
import { PlayerContextProvider } from "@components/PlayerContext";
import { HomeAssistant } from "@types";
import { IntlContextProvider } from "@components/i18n";

type CardOptions<Config extends { entity_id: string }> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: FunctionComponent<any>;
  validateConfig: (config: Config) => void;
  shouldUpdate?: (
    prevHass: HomeAssistant | null,
    hass: HomeAssistant | null,
    config: Config
  ) => boolean;
  providePlayerContext?: boolean;
  getCardSize?: () => number;
  getGridOptions?: () => {
    columns: number;
    min_columns: number;
    max_columns?: number;
    rows?: number;
    min_rows?: number;
    max_rows?: number;
  };
  getLayoutOptions?: () => Record<string, unknown>;
  editorElementName?: string;
  getStubConfig?: (hass: HomeAssistant) => Record<string, unknown>;
  registration?: {
    name: string;
    description: string;
    documentationURL?: string;
    preview?: boolean;
  };
};

type CardUpdaters<Config> = {
  setHass: (hass: HomeAssistant) => void;
  setConfig: (config: Config) => void;
};

function CardBridge<Config extends { entity_id: string }>({
  Component,
  rootElement,
  initialHass,
  initialConfig,
  providePlayerContext,
  updaterRef,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: FunctionComponent<any>;
  rootElement: HTMLElement;
  initialHass: HomeAssistant;
  initialConfig: Config;
  providePlayerContext: boolean;
  updaterRef: { current: CardUpdaters<Config> | null };
}) {
  const [hass, setHass] = useState<HomeAssistant>(initialHass);
  const [config, setConfig] = useState<Config>(initialConfig);

  // Assign updaters synchronously during render so they're available
  // immediately after the synchronous Preact render() call returns.
  updaterRef.current = { setHass, setConfig };

  const entityId = config.entity_id;

  return (
    <IntlContextProvider locale={hass.language ?? "en"}>
      <EmotionContextProvider rootElement={rootElement}>
        <CardContextProvider rootElement={rootElement} config={config}>
          <HassContextProvider hass={hass}>
            {providePlayerContext && entityId ? (
              <PlayerContextProvider entityId={entityId}>
                <Component />
              </PlayerContextProvider>
            ) : (
              <Component />
            )}
          </HassContextProvider>
        </CardContextProvider>
      </EmotionContextProvider>
    </IntlContextProvider>
  );
}

export function defineCard<Config extends { entity_id: string }>(
  elementName: string,
  options: CardOptions<Config>
): void {
  const {
    component,
    validateConfig,
    shouldUpdate,
    providePlayerContext = true,
    getCardSize,
    getGridOptions,
    getLayoutOptions,
    editorElementName,
    getStubConfig,
    registration,
  } = options;

  class CardElement extends HTMLElement {
    private _config: Config | null = null;
    private _previousHass: HomeAssistant | null = null;
    private _updaters: CardUpdaters<Config> | null = null;
    private _mounted = false;

    setConfig(config: Config) {
      validateConfig(config);
      this._config = config;
      this._updaters?.setConfig(config);
    }

    set hass(hass: HomeAssistant) {
      if (!this._config?.entity_id) return;

      if (!this._mounted) {
        this._mount(hass);
        return;
      }

      if (
        shouldUpdate &&
        !shouldUpdate(this._previousHass, hass, this._config)
      ) {
        this._previousHass = hass;
        return;
      }

      this._previousHass = hass;
      this._updaters?.setHass(hass);
    }

    private _mount(hass: HomeAssistant) {
      this._mounted = true;
      this._previousHass = hass;

      const updaterRef = { current: null as CardUpdaters<Config> | null };

      render(
        <CardBridge<Config>
          Component={component}
          rootElement={this}
          initialHass={hass}
          initialConfig={this._config!}
          providePlayerContext={providePlayerContext}
          updaterRef={updaterRef}
        />,
        this
      );

      // Preact render() is synchronous — updaters are available now
      this._updaters = updaterRef.current;
    }

    disconnectedCallback() {
      render(null, this);
      this._mounted = false;
      this._updaters = null;
    }

    connectedCallback() {
      if (!this._mounted && this._config && this._previousHass) {
        this._mount(this._previousHass);
      }
    }

    getCardSize() {
      return getCardSize?.() ?? 1;
    }

    getGridOptions() {
      return getGridOptions?.();
    }

    getLayoutOptions() {
      return getLayoutOptions?.();
    }

    static getConfigElement() {
      if (!editorElementName) return undefined;
      return document.createElement(editorElementName);
    }

    static getStubConfig(hass: HomeAssistant) {
      return getStubConfig?.(hass);
    }
  }

  customElements.define(elementName, CardElement);

  if (registration) {
    window.customCards = window.customCards || [];
    window.customCards.push({
      type: elementName,
      name: registration.name,
      preview: registration.preview ?? true,
      description: registration.description,
      documentationURL: registration.documentationURL,
    });
  }
}
