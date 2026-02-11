import type { LyrionBrowserItem, LyrionNavigationItem } from "@types";

/**
 * Build command and parameters based on navigation history
 */
export function buildBrowseParams(
  history: LyrionNavigationItem[],
  startIndex: number = 0,
  searchTerm: string = "",
  appSearchItemId?: string
): {
  command: string;
  parameters: string[];
} {
  if (history.length === 0) {
    if (!searchTerm) return { command: "", parameters: [] };
    return {
      command: "search",
      parameters: ["0", "100", `term:${searchTerm}`, "extended:1"],
    };
  }

  const current = history[history.length - 1];
  const params = [startIndex.toString(), "100"]; // start, itemsPerResponse

  // For root categories, just use the command
  if (history.length === 1) {
    let command = current.command;

    // Favorites special case - use "favorites" command with "items" as parameter
    if (command === "favorites") {
      // For lyrion_cli, pass "items" as first parameter
      const favoriteParams = ["items", "0", "100", "want_url:1"];
      return { command: "favorites", parameters: favoriteParams };
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

  // Check if we're inside an app (any history entry has type "app")
  const appEntry = history.find((h) => h.type === "app");
  if (appEntry) {
    const appParams = ["items", startIndex.toString(), "100"];

    if (searchTerm && appSearchItemId) {
      // Search uses the app's search node
      appParams.push(`item_id:${appSearchItemId}`);
      appParams.push(`search:${searchTerm}`);
    } else if (current.type !== "app") {
      // Regular browsing deeper within app
      appParams.push(`item_id:${current.id}`);
    }

    return { command: appEntry.command, parameters: appParams };
  }

  // For nested navigation, find relevant filter entries from history
  let command = current.command;
  const playlistEntry = history.find((h) => h.type === "playlist");
  const genreEntry = history.find((h) => h.type === "genre");
  const artistEntry = history.find((h) => h.type === "artist");
  const albumEntry = history.find((h) => h.type === "album");

  // Playlists special case
  if (playlistEntry && current.command === "titles") {
    command = "playlists tracks";
    params[0] = playlistEntry.id; // playlist_id
    params[1] = startIndex.toString(); // start
    params[2] = "100"; // count
    if (searchTerm) {
      params.push(`search:${searchTerm}`);
    }
    params.push("tags:altj");
    return { command, parameters: params };
  }

  // Add search parameter for nested navigation
  if (searchTerm) {
    params.push(`search:${searchTerm}`);
  }

  // Genre -> Artists
  if (genreEntry && current.command === "artists") {
    params.push(`genre_id:${genreEntry.id}`);
    params.push("tags:a");
  }

  // Artist -> Albums
  if (artistEntry && current.command === "albums") {
    params.push(`artist_id:${artistEntry.id}`);
    params.push("tags:alj");
  }

  // Album -> Tracks
  if (current.command === "titles" && !playlistEntry) {
    if (albumEntry) {
      params.push(`album_id:${albumEntry.id}`);
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
