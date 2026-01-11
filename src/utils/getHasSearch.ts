import { SearchConfig } from "@types";

export const getHasSearch = (
  search: SearchConfig | undefined,
  maEntityId?: string | null
): boolean => {
  if (!search && !maEntityId) {
    return false;
  }

  if (maEntityId && maEntityId.length > 0) {
    return true;
  }

  if (Array.isArray(search)) {
    return search.length > 0;
  }

  return search?.enabled === true;
};
