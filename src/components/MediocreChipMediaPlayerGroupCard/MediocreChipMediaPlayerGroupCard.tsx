import { useContext } from "preact/hooks";
import styled from "@emotion/styled";
import { GroupChipsController } from "@components";
import { CardContext, CardContextType } from "@components/CardContext";

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

const Wrap = styled.div`
  display: contents;
  --mmpc-chip-background: var(--card-background-color);
  --mmpc-chip-foreground: var(--primary-text-color);
`;

export const MediocreChipMediaPlayerGroupCard = () => {
  const { config } =
    useContext<CardContextType<MediocreChipMediaPlayerGroupCardConfig>>(
      CardContext
    );

  return (
    <Wrap>
      <GroupChipsController
        config={{
          entity_id: config.entity_id,
          speaker_group: {
            entities: config.entities,
          },
        }}
        showGrouped={true}
      />
    </Wrap>
  );
};
