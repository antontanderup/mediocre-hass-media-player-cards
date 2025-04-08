import { HomeAssistant } from "custom-card-helpers";
import { createContext } from "preact";

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
  return (
    <CardContext.Provider value={{ rootElement, hass, config }}>
      {children}
    </CardContext.Provider>
  );
};
