import { useMemo } from "preact/hooks";
import type { SqueezeboxServerStatusResponse } from "@types";
import { useLyrionBrowse } from "./useLyrionBrowse";

export type UseLyrionGlobalSearchParams = {
  entity_id: string;
  searchTerm: string;
  serverData: SqueezeboxServerStatusResponse | null;
  enabled: boolean;
};

/**
 * Hook that performs global search by firing parallel category-specific
 * queries (artists, albums, tracks, playlists). Each query uses proper
 * tags so that full metadata (including artist names) is returned.
 */
export function useLyrionGlobalSearch({
  entity_id,
  searchTerm,
  serverData,
  enabled,
}: UseLyrionGlobalSearchParams) {
  const artistParams = useMemo(
    () => ["0", "20", `search:${searchTerm}`, "tags:a"],
    [searchTerm]
  );
  const albumParams = useMemo(
    () => ["0", "20", `search:${searchTerm}`, "tags:alj"],
    [searchTerm]
  );
  const trackParams = useMemo(
    () => ["0", "20", `search:${searchTerm}`, "tags:altj"],
    [searchTerm]
  );
  const playlistParams = useMemo(
    () => ["0", "20", `search:${searchTerm}`],
    [searchTerm]
  );

  const artists = useLyrionBrowse({
    entity_id,
    command: "artists",
    parameters: artistParams,
    serverData,
    enabled,
  });

  const albums = useLyrionBrowse({
    entity_id,
    command: "albums",
    parameters: albumParams,
    serverData,
    enabled,
  });

  const tracks = useLyrionBrowse({
    entity_id,
    command: "titles",
    parameters: trackParams,
    serverData,
    enabled,
  });

  const playlists = useLyrionBrowse({
    entity_id,
    command: "playlists",
    parameters: playlistParams,
    serverData,
    enabled,
  });

  const items = useMemo(
    () => [
      ...artists.items,
      ...albums.items,
      ...tracks.items,
      ...playlists.items,
    ],
    [artists.items, albums.items, tracks.items, playlists.items]
  );

  const loading =
    artists.loading || albums.loading || tracks.loading || playlists.loading;
  const totalCount =
    artists.totalCount +
    albums.totalCount +
    tracks.totalCount +
    playlists.totalCount;

  return useMemo(
    () => ({ items, loading, totalCount }),
    [items, loading, totalCount]
  );
}
