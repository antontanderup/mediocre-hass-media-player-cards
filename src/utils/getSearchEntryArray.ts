import { SearchConfig, SearchEntry, SearchLegacyEntry } from "@types";
import { getHass } from "./getHass";
import { getSearchFilters } from "./getSearchFilters";

/**
 * Converts a SearchConfig (array or legacy entry) to a SearchEntry[] for unified handling.
 * If SearchConfig is a legacy entry, converts it to the new format.
 * If legacy entry is not enabled, returns an empty array.
 * If entity_id is missing in legacy entry, uses the provided entity_id.
 */
export function getSearchEntryArray(
  searchConfig: SearchConfig,
  entity_id: string
): SearchEntry[] {
  if (!searchConfig) return [];
  if (Array.isArray(searchConfig)) {
    // Already new format
    return searchConfig.map((entry) =>  {
      if (entry.media_types) {
        return {
          ...entry,
          media_types: undefined,
          filters: getSearchFilters(entry),
        };
      }
      return entry;
    });
  }
  // Legacy format
  const legacy = searchConfig as SearchLegacyEntry;
  if (legacy.enabled === false || legacy.enabled == null) return [];
  // Get friendly_name from hass
  const resolvedEntityId = legacy.entity_id ?? entity_id;
  let friendlyName: string | undefined = undefined;
  try {
    const hass = getHass();
    friendlyName = hass.states[resolvedEntityId]?.attributes?.friendly_name;
  } catch {
    // ignore if hass not available
  }
  return [
    {
      name: friendlyName ?? "Search",
      entity_id: resolvedEntityId,
      media_types: undefined,
      filters: getSearchFilters({
        entity_id: resolvedEntityId,
        media_types: legacy.media_types,
      }),
    },
  ];
}
