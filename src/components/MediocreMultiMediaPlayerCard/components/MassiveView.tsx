import type {
  MediocreMassiveMediaPlayerCardConfig,
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";
import { css } from "@emotion/react";
import { useContext, useMemo } from "preact/hooks";
import {
  CardContext,
  CardContextProvider,
  CardContextType,
} from "@components/CardContext";
import { MediocreMassiveMediaPlayerCard } from "@components/MediocreMassiveMediaPlayerCard";

const styles = {
  root: css({
    padding: 16,
    display: "grid",
    gap: 24,
    gridTemplateRows: "1fr auto",
    gridTemplateColumns: "1fr",
  }),
  massive: css({
    overflow: "hidden",
  }),
};

export type MassiveViewViewProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  height: number;
};

export const MassiveViewView = ({
  mediaPlayer,
  height,
}: MassiveViewViewProps) => {
  const { rootElement } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
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
    <div css={styles.root} style={{ height }}>
      <CardContextProvider rootElement={rootElement} config={massiveConfig}>
        <MediocreMassiveMediaPlayerCard css={styles.massive} />
      </CardContextProvider>
    </div>
  );
};
