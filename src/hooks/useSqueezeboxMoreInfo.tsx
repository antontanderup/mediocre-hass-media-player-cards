import { SqueezeboxStatusResponse, SqueezeboxSonginfoResponse } from "@types";
import { useHassMessagePromise } from "@hooks";
import { usePlayer } from "@components";
import { useEffect, useMemo } from "preact/hooks";

export const useSqueezeboxMoreInfo = ({
  lms_entity_id,
  enabled,
}: {
  lms_entity_id?: string;
  enabled?: boolean;
}) => {
  const player = usePlayer();

  const entity_id = lms_entity_id;

  const { data, loading, error, refetch } =
    useHassMessagePromise<SqueezeboxStatusResponse>(
      {
        type: "call_service",
        domain: "lyrion_cli",
        service: "query",
        service_data: {
          command: "status",
          entity_id,
          parameters: ["-"],
        },
        return_response: true,
      },
      {
        enabled: enabled,
        staleTime: 60000, // 1 minute
      }
    );

  const { data: currentTrack, error: currentTrackError } =
    useHassMessagePromise<SqueezeboxSonginfoResponse>(
      {
        type: "call_service",
        domain: "lyrion_cli",
        service: "query",
        service_data: {
          command: "songinfo",
          entity_id,
          parameters: [
            0,
            100,
            `track_id:${data?.playlist_loop?.find(i => Number(i["playlist index"]) === Number(data.playlist_cur_index))?.id}`,
          ],
        },
        return_response: true,
      },
      {
        enabled:
          enabled &&
          !!data?.playlist_loop?.find(
            i => Number(i["playlist index"]) === Number(data.playlist_cur_index)
          )?.id,
        staleTime: 86400000, // 24 hours
      }
    );

  useEffect(() => {
    if (player.attributes.media_title) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.attributes.media_title]); //  only refetch on title change

  return useMemo(
    () => ({
      status: data,
      currentTrack,
      loading: loading,
      error: error ?? currentTrackError ?? null,
    }),
    [data, currentTrack, loading, error, currentTrackError]
  );
};
