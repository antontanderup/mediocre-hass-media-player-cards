import { useContext } from "preact/hooks";
import type { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { CardContext, CardContextType } from "@components/CardContext";
import { MaSearch, HaSearch, useSearchProviderMenu } from "@components";

export const Search = () => {
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const { ma_entity_id, search, entity_id } = config;

  const { selectedSearchProvider, searchProvidersMenu } = useSearchProviderMenu(
    search,
    entity_id,
    ma_entity_id
  );

  if (!selectedSearchProvider) return null;
  if (selectedSearchProvider.entity_id === ma_entity_id) {
    return (
      <MaSearch
        maEntityId={ma_entity_id}
        horizontalPadding={16}
        additionalOptions={searchProvidersMenu}
        searchBarPosition="bottom"
      />
    );
  }
  return (
    <HaSearch
      entityId={selectedSearchProvider.entity_id}
      showFavorites={true}
      horizontalPadding={16}
      filterConfig={selectedSearchProvider.media_types}
      additionalOptions={searchProvidersMenu}
      searchBarPosition="bottom"
    />
  );
};
