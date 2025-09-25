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
    const speakerGroupEntities = config.media_players
      .filter(player => player.can_be_grouped)
      .map(player => {
        if (player.name) {
          return {
            name: player.name,
            entity: player.speaker_group_entity_id ?? player.entity_id,
          };
        } else {
          return player.speaker_group_entity_id ?? player.entity_id;
        }
      });
    return {
      type: "custom:mediocre-media-player-card",
      use_art_colors: config.use_art_colors,
      speaker_group:
        speakerGroupEntities.length > 0
          ? {
              entity_id:
                mediaPlayer.speaker_group_entity_id || mediaPlayer.entity_id,
              entities: speakerGroupEntities,
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
