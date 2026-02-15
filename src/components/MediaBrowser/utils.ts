import { HaEnqueueMode, HaMediaItem } from "@components/HaSearch/types";
import { MediaBrowserItem } from "./MediaBrowser";
import { MediaClass, MediaContentType } from "./types";

export const getEnqueueModeIcon = (enqueueMode: HaEnqueueMode) => {
  switch (enqueueMode) {
    case "play": // Play now
      return "mdi:play-circle";
    case "replace": // Replace the existing queue and play now
      return "mdi:playlist-remove";
    case "next": // Add to the current queue after the currently playing item
      return "mdi:playlist-play";
    case "add": // Add to the end of the queue
      return "mdi:playlist-plus";
    default:
      return "mdi:play-circle";
  }
};

export const getItemMdiIcon = (
  item: Partial<MediaBrowserItem> | Partial<HaMediaItem>
) => {
  if (item.thumbnail) return null;
  // this function is a little silly because it seems like there's no real standard way to declare these
  switch (item.media_content_type) {
    case MediaContentType.Albums:
      return "mdi:album";
    case MediaContentType.Artists:
      return "mdi:account-music";
    case MediaContentType.Tracks:
      return "mdi:music-note";
    case MediaContentType.Playlists:
      return "mdi:playlist-music";
    case MediaContentType.Genres:
      return "mdi:music-box-multiple";
    case MediaContentType.App:
      return "mdi:application";
    case MediaContentType.Favorites:
      return "mdi:star";
    case MediaContentType.NewMusic:
    case MediaContentType.AlbumArtists:
    case MediaContentType.Radios:
    default:
      break;
  }

  switch (item.children_media_class ?? item.media_class) {
    case MediaClass.Album:
      return "mdi:album";
    case MediaClass.Artist:
      return "mdi:account-music";
    case MediaClass.Track:
      return "mdi:music-note";
    case MediaClass.Playlist:
      return "mdi:playlist-music";
    case MediaClass.Genre:
      return "mdi:music-box-multiple";
    case MediaClass.App:
      return "mdi:application";
    case MediaClass.Music:
      return "mdi:music";
    case MediaClass.Podcast:
      return "mdi:podcast";
    case MediaClass.Directory:
      return "mdi:folder";
    default:
      return "mdi:folder";
  }
};
