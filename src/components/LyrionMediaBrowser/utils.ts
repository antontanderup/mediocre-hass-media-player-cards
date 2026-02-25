import type { LyrionBrowserItem, LyrionNavigationItem } from "./types";

/**
 * Pre-extracted navigation context passed to buildBrowseParams.
 * The caller (useLyrionMediaBrowserData) walks the history once and fills this
 * in, so buildBrowseParams stays a pure function with no history scanning.
 */
export type BrowseContext = {
  depth: number; // navHistory.length (1 = root category, >1 = nested)
  current: LyrionNavigationItem; // deepest history entry
  appCommand?: string; // set when any ancestor has type "app"
  appSearchItemId?: string; // search node id captured from the app root browse
  genreId?: string;
  artistId?: string;
  albumId?: string;
  playlistId?: string;
};

/**
 * Build command and parameters from a pre-extracted BrowseContext.
 */
export function buildBrowseParams(
  context: BrowseContext,
  startIndex: number = 0,
  searchTerm: string = ""
): {
  command: string;
  parameters: string[];
} {
  const {
    depth,
    current,
    appCommand,
    appSearchItemId,
    genreId,
    artistId,
    albumId,
    playlistId,
  } = context;

  const params = [startIndex.toString(), "100"]; // start, itemsPerResponse

  // For root categories, just use the command
  if (depth === 1) {
    const command = current.command;

    // Favorites special case - use "favorites" command with "items" as parameter
    if (command === "favorites") {
      // For lyrion_cli, pass "items" as first parameter
      return {
        command: "favorites",
        parameters: ["items", "0", "100", "want_url:1"],
      };
    }

    // Add extra parameters from category mapping
    if (current.parameters.length > 0) {
      params.push(...current.parameters);
    }

    // Add search parameter if provided
    if (searchTerm) {
      params.push(`search:${searchTerm}`);
    }

    // Add item-type filters for direct navigation (e.g. from search results)
    if (current.type === "album" && command === "titles") {
      params.push(`album_id:${current.id}`);
    } else if (current.type === "artist" && command === "albums") {
      params.push(`artist_id:${current.id}`);
    }

    if (command === "artists") {
      params.push("tags:a");
    } else if (command === "albums") {
      params.push("tags:alj");
    } else if (command === "titles") {
      params.push("tags:altj");
    }
    return { command, parameters: params };
  }

  // Inside an app
  if (appCommand) {
    const appParams = ["items", startIndex.toString(), "100"];

    if (searchTerm && appSearchItemId) {
      // Search uses the app's search node
      appParams.push(`item_id:${appSearchItemId}`);
      appParams.push(`search:${searchTerm}`);
    } else if (current.type !== "app") {
      // Regular browsing deeper within app
      appParams.push(`item_id:${current.id}`);
    }

    return { command: appCommand, parameters: appParams };
  }

  // Nested library navigation
  let command = current.command;

  // Playlists special case
  if (playlistId && current.command === "titles") {
    command = "playlists tracks";
    const plParams = [playlistId, startIndex.toString(), "100"];
    if (searchTerm) {
      plParams.push(`search:${searchTerm}`);
    }
    plParams.push("tags:altj");
    return { command, parameters: plParams };
  }

  // Add search parameter for nested navigation
  if (searchTerm) {
    params.push(`search:${searchTerm}`);
  }

  // Genre -> Artists
  if (genreId && current.command === "artists") {
    params.push(`genre_id:${genreId}`);
    params.push("tags:a");
  }

  // Artist -> Albums
  if (artistId && current.command === "albums") {
    params.push(`artist_id:${artistId}`);
    params.push("tags:alj");
  }

  // Album -> Tracks
  if (current.command === "titles" && !playlistId) {
    if (albumId) {
      params.push(`album_id:${albumId}`);
    }
    params.push("tags:altj");
  }

  return { command, parameters: params };
}

/**
 * Build search term for LMS `playlist loadtracks` command
 */
export function buildPlaylistSearchTerm(item: LyrionBrowserItem): string {
  switch (item.type) {
    case "track":
      return `track.id=${item.id}`;
    case "album":
      return `album.id=${item.id}`;
    case "artist":
      return `contributor.id=${item.id}`;
    case "playlist":
      return `playlist.id=${item.id}`;
    case "genre":
      return `genre.id=${item.id}`;
    default:
      return `track.id=${item.id}`;
  }
}
