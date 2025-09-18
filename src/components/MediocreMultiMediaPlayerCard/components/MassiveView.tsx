import type { MediocreMassiveMediaPlayerCardConfig, MediocreMultiMediaPlayer, MediocreMultiMediaPlayerCardConfig } from "@types";
import { css } from "@emotion/react";
import { useContext, useMemo } from "preact/hooks";
import { CardContext, CardContextProvider, CardContextType } from "@components/CardContext";
import { MediocreMassiveMediaPlayerCard } from "@components/MediocreMassiveMediaPlayerCard";

const styles = {
  root: css({
    height: "100%",
    padding: 16,
    overflow: "hidden",
  }),
};

export type MassiveViewViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
};

export const MassiveViewView = ({
  mediaPlayer,
}: MassiveViewViewProps) => {
  const { rootElement } = useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
    CardContext
  );
  const massiveConfig: MediocreMassiveMediaPlayerCardConfig = useMemo(() => {
    return {
      ...mediaPlayer,
      mode: "multi",
      type: "custom:mediocre-massive-media-player-card",
    };
  }, [mediaPlayer]);

  return (
    <div css={styles.root}>
      <CardContextProvider rootElement={rootElement} config={massiveConfig}>
        <MediocreMassiveMediaPlayerCard />
      </CardContextProvider>
    </div>
  );
};
