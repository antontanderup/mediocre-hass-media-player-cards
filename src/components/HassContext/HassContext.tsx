import { HomeAssistant } from "@types";
import { createContext } from "preact";
import { memo } from "preact/compat";
import { useContext } from "preact/hooks";

export type HassContextType = {
  hass: HomeAssistant;
};

export const HassContext = createContext<HassContextType>(
  {} as HassContextType
);

// Make the provider component properly generic
export const HassContextProvider = memo<
  HassContextType & { children: preact.ComponentChildren }
>(
  ({
    hass,
    children,
  }: HassContextType & {
    children: preact.ComponentChildren;
  }): preact.ComponentChildren => {
    return (
      <HassContext.Provider value={{ hass }}>{children}</HassContext.Provider>
    );
  }
);

export const useHass = () => {
  const context = useContext(HassContext);
  return context.hass;
};
