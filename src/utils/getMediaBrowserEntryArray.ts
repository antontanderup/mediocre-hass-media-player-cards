import { MediaBrowserConfig, MediaBrowserEntry } from "@types";

export const getHasMediaBrowserEntryArray = (
  mediaBrowser: MediaBrowserConfig | undefined,
  fallbackEntityId: string,
  maEntityId?: string | null
): MediaBrowserEntry[] => {
  if (Array.isArray(mediaBrowser)) {
    return mediaBrowser;
  }

  return [
    {
      entity_id: mediaBrowser?.entity_id ?? maEntityId ?? fallbackEntityId,
      ...(mediaBrowser?.media_types
        ? { media_types: mediaBrowser.media_types }
        : {}),
    },
  ];
};
