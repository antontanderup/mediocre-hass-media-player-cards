import { HomeAssistant } from "@types";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { MediaPlayerEntity } from "@types";

export type PlayerContextType = {
  player: MediaPlayerEntity & {
    title: string;
    subtitle?: string;
  };
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
  children: preact.ComponentChildren;
}): preact.ComponentChildren => {
  const contextValue = useMemo(() => {
    const player = hass.states[entityId] as MediaPlayerEntity;

    if (!player) {
      return {
        player: null,
      };
    }

    const {
      attributes: {
        media_title: mediaTitle,
        media_artist: artist,
        media_album_name: albumName,
        source,
        friendly_name: friendlyName,
      },
      state,
    } = player;

    if (state === "off") {
      return {
        player: { ...player, title: friendlyName, subtitle: undefined },
      };
    }

    if (state === "unavailable") {
      return {
        player: {
          ...player,
          title: "Unavailable",
          subtitle: `${entityId} unavailable`,
        },
      };
    }

    let title = mediaTitle;
    if (!title || title === "") {
      if (
        source &&
        typeof source === "string" &&
        !source.startsWith("media_player.")
      ) {
        title = source;
      } else {
        title = friendlyName;
      }
    }

    const subtitle =
      !!albumName || !!artist
        ? `${!!albumName && albumName !== title ? `${albumName} - ` : ""}${artist ?? ""}`
        : undefined;

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
