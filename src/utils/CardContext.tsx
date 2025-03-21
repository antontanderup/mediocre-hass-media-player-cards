import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { HomeAssistant } from "custom-card-helpers";
import { createContext } from "preact";
import { useState } from "preact/hooks";

export type CardContextType<T> = {
  rootElement: HTMLElement;
  hass: HomeAssistant;
  config: T;
};

export const CardContext = createContext<CardContextType<any>>({
  rootElement: null,
  hass: null,
  config: null,
});

export const CardContextProvider = ({
  rootElement,
  hass,
  config,
  children,
}) => {
  const [emotionCache] = useState(() =>
    createCache({ key: "mmpc", container: rootElement, speedy: false })
  );
  return (
    <CacheProvider value={emotionCache}>
      <CardContext.Provider value={{ rootElement, hass, config }}>
        {children}
      </CardContext.Provider>
    </CacheProvider>
  );
};
