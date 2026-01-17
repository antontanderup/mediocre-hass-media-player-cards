import { useIntl } from "@components/i18n";
import { OverlayMenuItem } from "@components/OverlayMenu/OverlayMenu";
import { SearchConfig } from "@types";
import { getHass, getSearchEntryArray } from "@utils";
import { useMemo, useState } from "preact/hooks";

export const useSearchProviderMenu = (
  search: SearchConfig,
  fallbackEntityId: string,
  ma_entity_id?: string | null
) => {
  const { t } = useIntl();
  const searchEntryArray = useMemo(() => {
    const entries = getSearchEntryArray(search, fallbackEntityId);
    if (ma_entity_id) {
      return [
        ...entries,
        {
          entity_id: ma_entity_id,
          name: "Music Assistant",
        },
      ];
    }
    return entries;
  }, [search, fallbackEntityId, ma_entity_id]);

  const [selectedSearchProvider, setSelectedSearchProvider] = useState<string>(
    searchEntryArray[0]?.entity_id ?? undefined
  );

  const searchProvidersMenu = useMemo(() => {
    if (searchEntryArray.length <= 1) {
      return [];
    }
    const menuItems: OverlayMenuItem[] = [
      {
        type: "title",
        label: t({
          id: "Search.search_provider.title",
          defaultMessage: "Search using..",
        }),
      },
    ];

    const hass = getHass();
    searchEntryArray.forEach(entry => {
      menuItems.push({
        type: "item",
        label:
          entry.name ??
          hass.states[entry.entity_id]?.attributes.friendly_name ??
          entry.entity_id,
        onClick: () => setSelectedSearchProvider(entry.entity_id),
        selected: selectedSearchProvider === entry.entity_id,
      });
    });
    return menuItems;
  }, [ma_entity_id, search, fallbackEntityId, selectedSearchProvider, t]);

  return useMemo(
    () => ({
      searchProvidersMenu,
      selectedSearchProviderEntityId: selectedSearchProvider,
      selectedSearchProvider: searchEntryArray.find(
        entry => entry.entity_id === selectedSearchProvider
      ),
    }),
    [searchProvidersMenu, selectedSearchProvider]
  );
};
