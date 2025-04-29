import { useContext } from "preact/hooks";
import styled from "@emotion/styled";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { MaSearch } from "@components/MaSearch";

const SearchContainer = styled.div`
  max-height: 300px;
  padding: 12px;
  border-top: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  overflow-y: auto;
`;

export const Search = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { ma_entity_id } = config;

  return (
    <SearchContainer>
      <MaSearch maEntityId={ma_entity_id} />
    </SearchContainer>
  );
};
