import { useMemo } from "preact/hooks";
import { useHassMessagePromise } from "@hooks/useHassMessagePromise";
import type {
  LyrionBrowseResponse,
  SqueezeboxServerStatusResponse,
} from "@types";
import { useLyrionBrowse } from "@components/LyrionMediaBrowser/useLyrionBrowse";

export function useLyrionRelatedAlbums({
  entity_id,
  artist,
  enabled = true,
}: {
  entity_id: string;
  artist: string;
  enabled?: boolean;
}) {
  const { data: serverData } =
    useHassMessagePromise<SqueezeboxServerStatusResponse>(
      {
        type: "call_service",
        domain: "lyrion_cli",
        service: "query",
        service_data: {
          command: "serverstatus",
          entity_id,
          parameters: ["-"],
        },
        return_response: true,
      },
      { enabled, staleTime: 600000 }
    );

  const artistSearchParams = useMemo(
    () => ["0", "5", `search:${artist}`],
    [artist]
  );

  const { data: artistsData } = useHassMessagePromise<LyrionBrowseResponse>(
    {
      type: "call_service",
      domain: "lyrion_cli",
      service: "query",
      service_data: {
        command: "artists",
        entity_id,
        parameters: artistSearchParams,
      },
      return_response: true,
    },
    { enabled: enabled && !!serverData && !!artist, staleTime: 300000 }
  );

  const artistId = artistsData?.artists_loop?.[0]?.id;

  const albumParams = useMemo(
    () => ["0", "20", `artist_id:${artistId}`, "tags:alj"],
    [artistId]
  );

  const { items: albums, loading } = useLyrionBrowse({
    entity_id,
    command: "albums",
    parameters: albumParams,
    serverData: serverData ?? null,
    enabled: enabled && !!artistId,
  });

  return useMemo(() => ({ albums, loading }), [albums, loading]);
}
