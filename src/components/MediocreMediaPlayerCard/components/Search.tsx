import { useContext } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { MaSearch, HaSearch, useSearchProviderMenu } from "@components";
import { css } from "@emotion/react";
import { theme } from "@constants";
import { getSearchFilters } from "@utils/getSearchFilters";

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

  const { selectedSearchProvider, searchProvidersMenu } = useSearchProviderMenu(
    search,
    entity_id,
    ma_entity_id
  );

  const renderSearch = () => {
    if (!selectedSearchProvider) return null;
    if (selectedSearchProvider.entity_id === ma_entity_id) {
      return (
        <MaSearch
          maEntityId={ma_entity_id}
          horizontalPadding={12}
          additionalOptions={searchProvidersMenu}
        />
      );
    }
    return (
      <HaSearch
        entityId={selectedSearchProvider.entity_id}
        showFavorites={true}
        horizontalPadding={12}
        filterConfig={getSearchFilters(selectedSearchProvider)}
        targetEntityId={selectedSearchProvider.target_entity_id}
        additionalOptions={searchProvidersMenu}
      />
    );
  };

  return <div css={styles.root}>{renderSearch()}</div>;
};
