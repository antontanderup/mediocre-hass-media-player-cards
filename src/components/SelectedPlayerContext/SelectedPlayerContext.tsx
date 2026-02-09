import { createContext } from "preact";
import {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "preact/hooks";
import { CardContext, CardContextType } from "@components/CardContext";
import { useHass } from "@components/HassContext";
import { selectActiveMultiMediaPlayer } from "@utils/selectActiveMultiMediaPlayer";
import {
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { PlayerContextProvider } from "@components/PlayerContext";

export interface SelectedPlayerContextType {
  selectedPlayer: MediocreMultiMediaPlayer | undefined;
  setSelectedPlayer: (player: MediocreMultiMediaPlayer | undefined) => void;
  setLastInteraction: () => void;
}

export const SelectedPlayerContext = createContext<
  SelectedPlayerContextType | undefined
>(undefined);

export const SelectedPlayerProvider = ({
  children,
}: {
  children: preact.ComponentChildren;
}) => {
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );
  const hass = useHass();
  const lastInteractionRef = useRef<number | null>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<
    MediocreMultiMediaPlayer | undefined
  >(() => selectActiveMultiMediaPlayer(hass, config));

  // Update selectedPlayer when hass or config changes, unless card was interacted with in last 2 minutes
  useEffect(() => {
    const now = Date.now();
    if (
      lastInteractionRef.current &&
      now - lastInteractionRef.current < 2 * 60 * 1000
    ) {
      return;
    }
    const newSelectedPlayer = selectActiveMultiMediaPlayer(
      hass,
      config,
      selectedPlayer
    );
    if (newSelectedPlayer?.entity_id !== selectedPlayer?.entity_id) {
      setSelectedPlayer(newSelectedPlayer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hass, config, selectedPlayer]);

  const setLastInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  return (
    <SelectedPlayerContext.Provider
      value={{ selectedPlayer, setSelectedPlayer, setLastInteraction }}
    >
      <PlayerContextProvider
        entityId={selectedPlayer?.entity_id || config.entity_id}
      >
        {children}
      </PlayerContextProvider>
    </SelectedPlayerContext.Provider>
  );
};

export const useSelectedPlayer = () => {
  const ctx = useContext(SelectedPlayerContext);
  if (!ctx)
    throw new Error(
      "useSelectedPlayer must be used within a SelectedPlayerProvider"
    );
  return ctx;
};
