import { CardContext, CardContextType } from "@components/CardContext";
import { MediocreCompactMultiMediaPlayerCard } from "@components/MediocreCompactMultiMediaPlayerCard";
import { MediocreLargeMultiMediaPlayerCard } from "@components/MediocreLargeMultiMediaPlayerCard";
import { SelectedPlayerProvider } from "@components/SelectedPlayerContext";
import { MediocreMultiMediaPlayerCardConfig } from "@types";
import { useContext } from "preact/hooks";

export const MediocreMultiMediaPlayerCard = () => {
  const { config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const Card =
    config.size === "compact"
      ? MediocreCompactMultiMediaPlayerCard
      : MediocreLargeMultiMediaPlayerCard;

  return (
    <SelectedPlayerProvider>
      <Card />
    </SelectedPlayerProvider>
  );
};
