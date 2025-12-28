import { MediaBrowserConfig, MediaBrowserEntry } from "@types";

export const getHasMediaBrowserEntryArray = (
  mediaBrowser: MediaBrowserConfig | undefined,
  fallbackEntityId: string
): MediaBrowserEntry[] => {
  if (Array.isArray(mediaBrowser)) {
    return mediaBrowser;
  }

  return [{ entity_id: mediaBrowser?.entity_id ?? fallbackEntityId }];
};
