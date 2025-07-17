import { HomeAssistant } from "@types";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { MediaPlayerEntity } from "@types";
import { getMediaPlayerTitleAndSubtitle } from "@utils/getMediaPlayerTitleAndSubtitle";

export type PlayerContextType = {
  player: Omit<
    MediaPlayerEntity & {
      title: string;
      subtitle?: string;
    },
    "last_changed" | "last_updated" | "context"
  >;
};

export const PlayerContext = createContext<PlayerContextType>({
  player: {} as PlayerContextType["player"],
});

export const PlayerContextProvider = ({
  hass,
  children,
  entityId,
}: {
  entityId: string;
  hass: HomeAssistant;
  children: preact.ComponentChildren;
}): preact.ComponentChildren => {
  const contextValue = useMemo((): PlayerContextType => {
    const player = hass.states[entityId] as MediaPlayerEntity;
    if (!player) {
      return {
        player: {
          entity_id: entityId,
          state: "unavailable",
          attributes: {},
          title: "Unavailable",
          subtitle: `${entityId} unavailable`,
        },
      };
    }
    const { title, subtitle } = getMediaPlayerTitleAndSubtitle(player);
    return {
      player: { ...player, title, subtitle },
    };
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
