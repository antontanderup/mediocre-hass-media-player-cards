import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { MaSearch, HaSearch } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";

const styles = {
  root: css({
    maxHeight: 300,
    paddingTop: 12,
    paddingBottom: 12,
    borderTop: `0.5px solid ${theme.colors.onCardDivider}`,
    overflowY: "auto",
  }),
};

export const Search = () => {
  const { config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { ma_entity_id, search, entity_id } = config;

  const renderSearch = () => {
    if (ma_entity_id) {
      return <MaSearch maEntityId={ma_entity_id} horizontalPadding={12} />;
    }
    if (search?.enabled) {
      return (
        <HaSearch
          entityId={search.entity_id ?? entity_id}
          horizontalPadding={12}
        />
      );
    }
    return null;
  };

  return <div css={styles.root}>{renderSearch()}</div>;
};
