import { useContext } from "preact/hooks";
import { GroupChipsController } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";
import { css } from "@emotion/react";

export type MediocreChipMediaPlayerGroupCardConfig = {
  entity_id: string;
  entities: string[];
};

export type Player = {
  entity_id: string;
  friendly_name: string;
};

export type GroupPlayer = Player & {
  isGrouped: boolean;
  isGrouping: boolean;
};

const styles = {
  root: css({
    display: "contents",
    "--mmpc-chip-background": "var(--card-background-color)",
    "--mmpc-chip-foreground": "var(--primary-text-color)",
  }),
};

export const MediocreChipMediaPlayerGroupCard = () => {
  const { config } =
    useContext<CardContextType<MediocreChipMediaPlayerGroupCardConfig>>(
      CardContext
    );

  return (
    <div css={styles.root}>
      <GroupChipsController
        config={{
          entity_id: config.entity_id,
          speaker_group: {
            entities: config.entities,
          },
        }}
        showGrouped={true}
      />
    </div>
  );
};
