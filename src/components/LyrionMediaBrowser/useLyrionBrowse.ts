import { useMemo } from "preact/hooks";
import { useHassMessagePromise } from "@hooks/useHassMessagePromise";
import type {
  LyrionBrowseResponse,
  LyrionBrowserItem,
  SqueezeboxServerStatusResponse,
} from "@types";

/**
 * Build the base URL for the LMS server
 */
function getServerBaseUrl(
  serverData: SqueezeboxServerStatusResponse | null
): string | undefined {
  if (!serverData?.ip || !serverData?.httpport) return undefined;
  return `http://${serverData.ip}:${serverData.httpport}`;
}

/**
 * Build artwork URL for LMS items using artwork_track_id
 */
function buildArtworkUrl(
  serverData: SqueezeboxServerStatusResponse | null,
  artworkTrackId?: string
): string | undefined {
  const baseUrl = getServerBaseUrl(serverData);
  if (!baseUrl || !artworkTrackId) return undefined;
  return `${baseUrl}/music/${artworkTrackId}/cover_300x300_o`;
}

/**
 * Resolve an image URL that may be relative or absolute
 */
function resolveImageUrl(
  serverData: SqueezeboxServerStatusResponse | null,
  ...urls: (string | undefined)[]
): string | undefined {
  const url = urls.find(u => !!u);
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = getServerBaseUrl(serverData);
  if (!baseUrl) return undefined;
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Transform LMS response to unified browser items
 */
function transformResponseToItems(
  response: LyrionBrowseResponse | null,
  serverData: SqueezeboxServerStatusResponse | null
): LyrionBrowserItem[] {
  if (!response) return [];

  // Artists (artists_loop from browse, contributors_loop from search)
  const artists = response.artists_loop || response.contributors_loop;
  if (artists) {
    const baseUrl = getServerBaseUrl(serverData);
    return artists.map(artist => ({
      id: artist.id,
      title: artist.artist,
      type: "artist" as const,
      can_play: true,
      can_expand: true,
      thumbnail: baseUrl
        ? `${baseUrl}/imageproxy/mai/artist/${artist.id}/image_300x300_f`
        : undefined,
    }));
  }

  // Albums
  if (response.albums_loop) {
    return response.albums_loop.map(album => ({
      id: album.id,
      title: album.album,
      subtitle: album.artist,
      type: "album" as const,
      can_play: true,
      can_expand: true,
      artworkTrackId: album.artwork_track_id,
      thumbnail: buildArtworkUrl(serverData, album.artwork_track_id),
    }));
  }

  // Tracks (titles_loop, tracks_loop from search, or playlisttracks_loop)
  const tracks =
    response.titles_loop ||
    response.tracks_loop ||
    response.playlisttracks_loop;
  if (tracks) {
    return tracks.map(track => ({
      id: track.id,
      title: track.title,
      subtitle: track.artist,
      type: "track" as const,
      can_play: true,
      can_expand: false,
      artworkTrackId: track.artwork_track_id || track.id,
      thumbnail: buildArtworkUrl(
        serverData,
        track.artwork_track_id || track.id
      ),
      duration: track.duration,
    }));
  }

  // Genres
  if (response.genres_loop) {
    return response.genres_loop.map(genre => ({
      id: genre.id,
      title: genre.genre,
      type: "genre" as const,
      can_play: false,
      can_expand: true,
    }));
  }

  // Playlists
  if (response.playlists_loop) {
    return response.playlists_loop.map(playlist => ({
      id: playlist.id,
      title: playlist.playlist,
      type: "playlist" as const,
      can_play: true,
      can_expand: true,
    }));
  }

  // Apps / Radio
  const appsLoop = response.appss_loop || response.radioss_loop;
  if (appsLoop) {
    return appsLoop.map(app => ({
      id: app.cmd,
      title: app.name,
      type: "app" as const,
      can_play: false,
      can_expand: true,
      thumbnail: resolveImageUrl(serverData, app.icon),
    }));
  }

  // Favorites / App items (loop_loop)
  if (response.loop_loop) {
    return response.loop_loop
      .filter(item => item.type !== "search") // Search items handled separately
      .map(favorite => {
        const rawTitle =
          favorite.line1 || favorite.name || favorite.title || "Unknown";
        const subtitle = favorite.artist || favorite.line2;
        // If no structured subtitle, try to extract "by Artist" from title
        let title = rawTitle;
        let extractedSubtitle = subtitle;
        if (!extractedSubtitle) {
          const byIndex = rawTitle.lastIndexOf(" by ");
          if (byIndex > 0) {
            title = rawTitle.substring(0, byIndex);
            extractedSubtitle = rawTitle.substring(byIndex + 4);
          }
        }
        return {
          id: favorite.id,
          title,
          url: favorite.url,
          subtitle: extractedSubtitle,
          type: "playlist" as const,
          can_play: favorite.isaudio === 1,
          can_expand: (favorite.hasitems ?? 0) > 0,
          thumbnail: resolveImageUrl(
            serverData,
            favorite.image,
            favorite.icon,
            favorite.artwork_url
          ),
        };
      });
  }

  return [];
}

export type UseLyrionBrowseParams = {
  entity_id: string;
  command: string;
  parameters: string[];
  serverData: SqueezeboxServerStatusResponse | null;
  enabled?: boolean;
};

/**
 * Hook for browsing LMS library using lyrion_cli
 */
export function useLyrionBrowse({
  entity_id,
  command,
  parameters,
  serverData,
  enabled = true,
}: UseLyrionBrowseParams) {
  const { data, loading, error, refetch } =
    useHassMessagePromise<LyrionBrowseResponse>(
      {
        type: "call_service",
        domain: "lyrion_cli",
        service: "query",
        service_data: {
          command,
          entity_id,
          parameters,
        },
        return_response: true,
      },
      {
        enabled: enabled && !!serverData,
        staleTime: 60000, // 1 minute
      }
    );

  const items = useMemo(
    () => transformResponseToItems(data, serverData),
    [data, serverData]
  );

  const totalCount = data?.count ?? 0;

  // Extract search item id from loop_loop (used by apps like Spotty)
  const searchItemId = useMemo(() => {
    if (!data?.loop_loop) return undefined;
    const searchItem = data.loop_loop.find(
      (item: { type?: string }) => item.type === "search"
    );
    return searchItem?.id;
  }, [data]);

  return useMemo(
    () => ({ items, loading, error, refetch, totalCount, searchItemId }),
    [items, loading, error, refetch, totalCount, searchItemId]
  );
}
