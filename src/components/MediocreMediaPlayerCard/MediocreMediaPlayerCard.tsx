import {
  CardContext,
  CardContextProvider,
  CardContextType,
} from "@components/CardContext";
import { useContext, useMemo } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { getMediocreLegacyConfigToMediocreMultiConfig } from "@utils";
import { MediocreCompactMultiMediaPlayerCard } from "@components/MediocreCompactMultiMediaPlayerCard";
import { SelectedPlayerProvider } from "@components/SelectedPlayerContext";

export type MediocreMediaPlayerCardProps = {
  isEmbeddedInMultiCard?: boolean;
  onClick?: () => void;
};

export const MediocreMediaPlayerCard = ({
  isEmbeddedInMultiCard,
  onClick,
}: MediocreMediaPlayerCardProps) => {
  const { rootElement, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);

  const multiConfig = useMemo(() => {
    return getMediocreLegacyConfigToMediocreMultiConfig(config);
  }, [config]);

  return (
    <CardContextProvider rootElement={rootElement} config={multiConfig}>
      <SelectedPlayerProvider>
        <MediocreCompactMultiMediaPlayerCard
          isEmbeddedInMultiCard={isEmbeddedInMultiCard}
          onClick={onClick}
        />
      </SelectedPlayerProvider>
    </CardContextProvider>
  );
};
