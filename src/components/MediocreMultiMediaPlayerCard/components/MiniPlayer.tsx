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
import { memo } from "preact/compat";
import { useCallback, useContext, useMemo } from "preact/hooks";
import { NavigationRoute } from "../MediocreMultiMediaPlayerCard";

export type MiniPlayerProps = {
  mediaPlayer: MediocreMultiMediaPlayer;
  setNavigationRoute: (route: NavigationRoute) => void;
  navigationRoute: NavigationRoute;
};

const styles = {
  root: css({
    borderRadius: "12px",
    overflow: "hidden",
  }),
};

export const MiniPlayer = memo<MiniPlayerProps>(({ mediaPlayer, setNavigationRoute, navigationRoute }) => {
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
      options: {
        show_volume_step_buttons:
          config.options?.show_volume_step_buttons ?? false,
        use_volume_up_down_for_step_buttons:
          config.options?.use_volume_up_down_for_step_buttons ?? false,
      },
      ...rest,
    };
  }, [mediaPlayer]);

  const handleOnClick = useCallback(() => {
    if (navigationRoute === "speaker-grouping") {
      return setNavigationRoute("massive");
    } 
    return setNavigationRoute("speaker-grouping");
  }, [setNavigationRoute, navigationRoute]);

  return (
    <div css={styles.root}>
      <CardContextProvider rootElement={rootElement} config={cardConfig}>
        <MediocreMediaPlayerCard isEmbeddedInMultiCard onClick={handleOnClick} />
      </CardContextProvider>
    </div>
  );
});
