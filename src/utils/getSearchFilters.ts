import { SearchEntry, searchFilter } from "@types";

/**
 * Converts the media_types array in a SearchEntry to an array of filters.
 * Each media_type is mapped to a filter with media_content_type.
 * If no media_types are present, returns undefined.
 */
export function getSearchFilters(
  entry: SearchEntry
): Array<typeof searchFilter.infer> | undefined {
  if (entry.filters && entry.filters.length > 0) {
    return entry.filters;
  }
  if (!entry.media_types || entry.media_types.length === 0) return undefined;
  return entry.media_types.map(mt => ({
    ...(mt.icon ? { icon: mt.icon } : {}),
    ...(mt.name ? { name: mt.name } : {}),
    media_content_type: mt.media_type,
  }));
}
