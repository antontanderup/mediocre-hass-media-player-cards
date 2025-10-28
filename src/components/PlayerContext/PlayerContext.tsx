import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { MediaPlayerEntity } from "@types";
import { getMediaPlayerTitleAndSubtitle } from "@utils/getMediaPlayerTitleAndSubtitle";
import { memo } from "preact/compat";
import { useHass } from "@components";

export type PlayerContextType = {
  player: Omit<
    MediaPlayerEntity & {
      title: string;
      subtitle?: string;
    },
    "last_changed" | "last_updated" | "context"
  >;
};

type PlayerContextProviderProps = {
  entityId: string;
  children:
    | preact.ComponentChildren
    | ((value: PlayerContextType) => preact.ComponentChildren);
};

export const PlayerContext = createContext<PlayerContextType>({
  player: {} as PlayerContextType["player"],
});

export const PlayerContextProvider = memo<PlayerContextProviderProps>(
  ({
    children,
    entityId,
  }: PlayerContextProviderProps): preact.ComponentChildren => {
    const hass = useHass();

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
    }, [hass.states[entityId], entityId]);

    return (
      <PlayerContext.Provider value={contextValue}>
        {typeof children === "function" ? children(contextValue) : children}
      </PlayerContext.Provider>
    );
  }
);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("useHass must be used within a HassContextProvider");
  }
  return context.player;
};
