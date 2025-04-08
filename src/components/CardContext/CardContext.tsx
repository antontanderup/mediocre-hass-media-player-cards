import { HomeAssistant } from "custom-card-helpers";
import { createContext } from "preact";

export type CardContextType<T> = {
  rootElement: HTMLElement;
  hass: HomeAssistant;
  config: T;
};

// Create a default context with generic type parameter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CardContext = createContext<CardContextType<any>>({
  rootElement: null,
  hass: null,
  config: null,
});

// Make the provider component properly generic
export const CardContextProvider = <T,>({
  rootElement,
  hass,
  config,
  children,
}: CardContextType<T> & {
  children: React.ReactElement;
}): React.ReactElement => {
  return (
    <CardContext.Provider value={{ rootElement, hass, config }}>
      {children}
    </CardContext.Provider>
  );
};
