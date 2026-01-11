import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { MaSearch, HaSearch } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { getSearchEntryArray } from "@utils";

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
    const searchArray = getSearchEntryArray(search, entity_id);
    if (searchArray.length > 0) {
      return (
        <HaSearch
          entityId={searchArray[0].entity_id}
          showFavorites={true}
          horizontalPadding={12}
          filterConfig={searchArray[0].media_types}
        />
      );
    }
    return null;
  };

  return <div css={styles.root}>{renderSearch()}</div>;
};
