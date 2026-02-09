import { SqueezeboxStatusResponse, SqueezeboxSonginfoResponse } from "@types";
import { useHassMessagePromise } from "@hooks";
import { usePlayer } from "@components";
import { useEffect, useMemo } from "preact/hooks";

export const useSqueezeboxMoreInfo = (lms_entity_id: string) => {
    const player = usePlayer();

    const enabled = !!lms_entity_id;
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
                staleTime: 30000, // 30 seconds
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
                enabled: !!data?.playlist_loop?.find(
                    i => Number(i["playlist index"]) === Number(data.playlist_cur_index)
                )?.id,
                staleTime: 86400000, // 24 hours
            }
        );

    useEffect(() => {
        if (player.attributes.media_title) {
            refetch();
        }
    }, [player.attributes.media_title, refetch]);

    return useMemo(
        () => ({
            status: data,
            currentTrack,
            loading: loading,
            error: error ?? currentTrackError ?? null,
        }),
        [data, currentTrack, error, currentTrackError]
    );
};
