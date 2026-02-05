import { getHassMessageWithCache } from "@utils/getHassMessageWithCache";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { useHassMessagePromise } from "./useHassMessagePromise";
import { usePlayer } from "@components";
import { getHass } from "@utils";
import { QueueItem } from "@types";

type SqueezeboxPlaylistItem = {
  id: string;
  title: string;
  "playlist index": number;
};

type SqueezeboxStatusResponse = {
  player_ip?: string;
  playlist_cur_index?: number;
  playlist_loop?: SqueezeboxPlaylistItem[];
  [key: string]: unknown;
};

type SqueezeboxSongInfoLoopItem = {
  id?: string;
  title?: string;
  artist?: string;
  coverid?: string;
  duration?: number;
  coverart?: string;
  album?: string;
  modificationTime?: string;
  type?: string;
  bitrate?: string;
  remote?: number;
  year?: string;
  addedTime?: string;
  artwork_url?: string;
  lastUpdated?: string;
  live_edge?: string;
  artwork_track_id?: string;
};

type SqueezeboxSonginfoResponse = {
  response: {
    songinfo_loop?: SqueezeboxSongInfoLoopItem[];
  };
  [key: string]: unknown;
};

type SqueezeboxServerStatusResponse = {
  ip?: string;
  httpport?: string;
  [key: string]: unknown;
};

export const useSqueezeboxQueue = (entity_id: string, enabled: boolean) => {
  const player = usePlayer();
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
      {
        enabled: enabled,
        staleTime: 600000, // 10 minutes
      }
    );

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
        enabled: enabled && !!serverData,
        staleTime: 30000, // 30 seconds
      }
    );

  const moveItem = useCallback(
    async (fromIndex: number, toIndex: number) => {
      await getHass().callService("lyrion_cli", "method", {
        command: "playlist",
        entity_id,
        parameters: ["move", fromIndex, toIndex],
      });
      refetch();
    },
    [entity_id, refetch]
  );

  const skipToItem = useCallback(
    async (index: number) => {
      await getHass().callService("lyrion_cli", "method", {
        command: "playlist",
        entity_id,
        parameters: ["index", index],
      });
    },
    [entity_id]
  );

  const deleteItem = useCallback(
    async (index: number) => {
      await getHass().callService("lyrion_cli", "method", {
        command: "playlist",
        entity_id,
        parameters: ["delete", index],
      });
      refetch();
    },
    [entity_id, refetch]
  );

  const clearQueue = useCallback(async () => {
    await getHass().callService("media_player", "clear_playlist", {
      entity_id,
    });
    refetch();
  }, [entity_id, refetch]);

  const [queue, setQueue] = useState<QueueItem[]>([]);

  const debounceInfoTimeout = useRef<NodeJS.Timeout | undefined>();
  const populateQueueInfo = useCallback(async () => {
    if (debounceInfoTimeout.current) {
      clearTimeout(debounceInfoTimeout.current);
    }
    debounceInfoTimeout.current = setTimeout(async () => {
      if (data?.playlist_loop) {
        const playlistItems: QueueItem[] = [];
        const currentIndex = data.playlist_cur_index
          ? Number(data.playlist_cur_index)
          : -1;
        let newQueue: QueueItem[] = data.playlist_loop.map((item, index) => ({
          id: item.id,
          title: item.title,
          artist: "-",
          playlistIndex: item["playlist index"],
          isPlaying: item["playlist index"] === currentIndex,
          isFirst: index === 0,
          isLast: index === data.playlist_loop!.length - 1,
          moveItem: (toIndex: number) =>
            moveItem(item["playlist index"], toIndex),
          skipToItem: () => skipToItem(item["playlist index"]),
          deleteItem: () => deleteItem(item["playlist index"]),
        }));
        newQueue = newQueue
          .slice(newQueue.findIndex(i => !i.isPlaying))
          .filter(item => !item.isPlaying);

        if (queue.length === 0) {
          setQueue(newQueue);
        }

        for (const item of newQueue) {
          let queueItem: QueueItem = item;
          const squeezeboxSongInfo =
            await getHassMessageWithCache<SqueezeboxSonginfoResponse>(
              {
                type: "call_service",
                domain: "lyrion_cli",
                service: "query",
                service_data: {
                  command: "songinfo",
                  entity_id,
                  parameters: [0, 100, `track_id:${item.id}`],
                },
                return_response: true,
              },
              { staleTime: 86400000 } // 24 hours
            );
          if (
            squeezeboxSongInfo.response &&
            squeezeboxSongInfo.response.songinfo_loop &&
            squeezeboxSongInfo.response.songinfo_loop.length > 0
          ) {
            const songinfo = Object.assign(
              {},
              ...squeezeboxSongInfo.response.songinfo_loop
            ) as SqueezeboxSongInfoLoopItem;
            queueItem = {
              ...queueItem,
              album: songinfo.album,
              artist: songinfo.artist,
            };
            const rootPath = `http://${serverData?.ip}:${serverData?.httpport}`;
            if (songinfo.artwork_url && data.player_ip) {
              queueItem = {
                ...queueItem,
                artworkUrl: `${rootPath}${songinfo.artwork_url}`,
              };
            } else if (songinfo.artwork_track_id) {
              queueItem = {
                ...queueItem,
                artworkUrl: `${rootPath}/music/${songinfo.artwork_track_id}/cover_50x50_o`,
              };
            }
          }
          playlistItems.push(queueItem);
        }

        setQueue(playlistItems);
      }
    }, 250);
  }, [data, entity_id, moveItem, skipToItem, deleteItem, setQueue]);

  useEffect(() => {
    populateQueueInfo();
  }, [data]);

  useEffect(() => {
    if (!data) return;
    refetch();
  }, [player.title]);

  return useMemo(
    () => ({ queue, loading, error, refetch, clearQueue }),
    [queue, loading, error, refetch, clearQueue]
  );
};
