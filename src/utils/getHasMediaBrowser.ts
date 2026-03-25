import { MediaBrowserConfig } from "@types";

export const getHasMediaBrowser = (
  mediaBrowser: MediaBrowserConfig | undefined,
  maEntityId?: string | null
): boolean => {
  if (!mediaBrowser) {
    return !!maEntityId;
  }

  if (Array.isArray(mediaBrowser)) {
    return mediaBrowser.length > 0;
  }

  if (mediaBrowser.enabled === false) {
    return false;
  }

  return mediaBrowser.enabled === true;
};
