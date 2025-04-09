import { HassEntity } from "home-assistant-js-websocket";
import { HomeAssistant } from "custom-card-helpers";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";

export type PlayerContextType = {
  player: HassEntity;
};

export const PlayerContext = createContext<PlayerContextType>({
  player: null,
});

export const PlayerContextProvider = ({
  hass,
  children,
  entityId,
}: {
  entityId: string;
  hass: HomeAssistant;
  children: React.ReactElement;
}): React.ReactElement => {
  const contextValue = useMemo(() => {
    return { player: hass.states[entityId] };
  }, [hass.states, entityId]);

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("useHass must be used within a HassContextProvider");
  }
  return context.player;
};
