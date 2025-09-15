import {
  CardContext,
  CardContextProvider,
  CardContextType,
} from "@components/CardContext";
import { MediocreMediaPlayerCard } from "@components/MediocreMediaPlayerCard";
import { css } from "@emotion/react";
import {
  MediocreMultiMediaPlayer,
  MediocreMultiMediaPlayerCardConfig,
  MediocreMediaPlayerCardConfig,
} from "@types";
import { useContext, useMemo } from "preact/hooks";

export type MiniPlayerProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
};

const styles = {
  root: css({
    borderRadius: "12px",
    overflow: "hidden"
  })
}

export const MiniPlayer = ({ mediaPlayer }: MiniPlayerProps) => {
  const { rootElement } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const cardConfig: MediocreMediaPlayerCardConfig = useMemo(() => {
    return {
      type: "custom:mediocre-media-player-card",
      ...mediaPlayer,
    };
  }, [mediaPlayer]);

  return (
    <div css={styles.root}>

    <CardContextProvider rootElement={rootElement} config={cardConfig}>
      <MediocreMediaPlayerCard />
    </CardContextProvider>
    </div>
  );
};
