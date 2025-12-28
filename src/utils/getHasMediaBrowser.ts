import { MediaBrowserConfig } from "@types";

export const getHasMediaBrowser = (
  mediaBrowser: MediaBrowserConfig | undefined
): boolean => {
  if (!mediaBrowser) {
    return false;
  }

  if (Array.isArray(mediaBrowser)) {
    return mediaBrowser.length > 0;
  }

  return mediaBrowser.enabled === true;
};
