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
    overflow: "hidden",
  }),
};

export const MiniPlayer = ({ mediaPlayer }: MiniPlayerProps) => {
  const { rootElement, config } =
    useContext<CardContextType<MediocreMultiMediaPlayerCardConfig>>(
      CardContext
    );

  const cardConfig: MediocreMediaPlayerCardConfig = useMemo(() => {
    const { custom_buttons: _custom_buttons, ...rest } = mediaPlayer;
    return {
      type: "custom:mediocre-media-player-card",
      speaker_group: config.speaker_group
        ? {
            ...config.speaker_group,
            entity_id: mediaPlayer.speaker_group_entity_id,
          }
        : undefined,
      ...rest,
    };
  }, [mediaPlayer]);

  return (
    <div css={styles.root}>
      <CardContextProvider rootElement={rootElement} config={cardConfig}>
        <MediocreMediaPlayerCard isEmbeddedInMultiCard />
      </CardContextProvider>
    </div>
  );
};
