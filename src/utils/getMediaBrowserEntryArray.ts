import { MediaBrowserConfig, MediaBrowserEntry } from "@types";

export const getHasMediaBrowserEntryArray = (
  mediaBrowser: MediaBrowserConfig | undefined,
  fallbackEntityId: string
): MediaBrowserEntry[] => {
  if (Array.isArray(mediaBrowser)) {
    return mediaBrowser;
  }

  return [
    {
      entity_id: mediaBrowser?.entity_id ?? fallbackEntityId,
      ...(mediaBrowser?.media_types
        ? { media_types: mediaBrowser.media_types }
        : {}),
    },
  ];
};
