import { HomeAssistant } from "@types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type HassContextType = {
  hass: HomeAssistant;
};

export const HassContext = createContext<HassContextType>({
  hass: null,
});

// Make the provider component properly generic
export const HassContextProvider = ({
  hass,
  children,
}: HassContextType & {
  children: preact.ComponentChildren;
}): preact.ComponentChildren => {
  return (
    <HassContext.Provider value={{ hass }}>{children}</HassContext.Provider>
  );
};

export const useHass = () => {
  const context = useContext(HassContext);
  if (!context) {
    throw new Error("useHass must be used within a HassContextProvider");
  }
  return context.hass;
};
