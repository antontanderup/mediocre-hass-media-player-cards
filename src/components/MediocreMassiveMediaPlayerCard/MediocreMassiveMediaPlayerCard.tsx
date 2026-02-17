import { useContext, useMemo } from "preact/hooks";
import {
  CardContext,
  CardContextProvider,
  CardContextType,
} from "@components/CardContext";
import { MediocreMassiveMediaPlayerCardConfig } from "@types";
import {
  MediocreLargeMultiMediaPlayerCard,
  SelectedPlayerProvider,
} from "@components";
import { getMediocreMassiveLegacyConfigToMediocreMultiConfig } from "@utils/getMediocreMassiveLegacyConfigToMultiConfig";

export const MediocreMassiveMediaPlayerCard = ({
  className,
}: {
  className?: string;
}) => {
  const { config, rootElement } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const multiConfig = useMemo(() => {
    return getMediocreMassiveLegacyConfigToMediocreMultiConfig(config);
  }, [config]);

  return (
    <CardContextProvider rootElement={rootElement} config={multiConfig}>
      <SelectedPlayerProvider>
        <MediocreLargeMultiMediaPlayerCard className={className} />
      </SelectedPlayerProvider>
    </CardContextProvider>
  );
};
