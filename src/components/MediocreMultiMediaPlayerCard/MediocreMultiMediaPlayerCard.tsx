import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreMultiMediaPlayerCardConfig } from "@types";
import { useContext, useMemo, useState } from "preact/hooks";
import { MiniPlayer } from "./components";

export const MediocreMultiMediaPlayerCard = () => {
  const { rootElement, config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);

  const selectedPlayer = useMemo(() => {
    return config.media_players[selectedPlayerIndex];
  }, [config, selectedPlayerIndex]);

  return (
    <div>
      <MiniPlayer mediaPlayer={selectedPlayer} />
    </div>
  );
};
