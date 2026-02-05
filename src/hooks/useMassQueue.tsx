import { useCallback, useEffect, useMemo } from "preact/hooks";
import { useHassMessagePromise } from "./useHassMessagePromise";
import { usePlayer } from "@components";
import { getHass } from "@utils";
import { QueueItem } from "@types";

type MassQueueResponse = {
  [key: string]: MassQueueItem[];
};

type MassQueueItem = {
  queue_item_id: string;
  media_title: string;
  media_album_name?: string;
  media_artist?: string;
  media_content_id?: string;
  media_image?: string;
};

export const useMassQueue = (entity_id: string, enabled: boolean) => {
  const player = usePlayer();
  const { data, loading, error, refetch } =
    useHassMessagePromise<MassQueueResponse>(
      {
        type: "call_service",
        domain: "mass_queue",
        service: "get_queue_items",
        service_data: {
          entity: entity_id,
        },
        return_response: true,
      },
      {
        enabled: enabled,
        staleTime: 30000, // 30 seconds
      }
    );

  const skipToItem = useCallback(
    async (queue_item_id: string) => {
      await getHass().callService("mass_queue", "play_queue_item", {
        entity: entity_id,
        queue_item_id,
      });
    },
    [entity_id]
  );

  const deleteItem = useCallback(
    async (queue_item_id: string) => {
      await getHass().callService("mass_queue", "remove_queue_item", {
        entity: entity_id,
        queue_item_id,
      });
      refetch();
    },
    [entity_id, refetch]
  );

  const moveItemUp = useCallback(
    async (queue_item_id: string) => {
      await getHass().callService("mass_queue", "move_queue_item_up", {
        entity: entity_id,
        queue_item_id,
      });
      // Small delay to allow backend to process the move (else it will return the old order)
      await new Promise(resolve => setTimeout(resolve, 100));
      refetch();
    },
    [entity_id, refetch]
  );

  const moveItemDown = useCallback(
    async (queue_item_id: string) => {
      await getHass().callService("mass_queue", "move_queue_item_down", {
        entity: entity_id,
        queue_item_id,
      });
      // Small delay to allow backend to process the move (else it will return the old order)
      await new Promise(resolve => setTimeout(resolve, 100));
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

  const queue = useMemo<QueueItem[]>(() => {
    const items =
      data?.[entity_id]?.map((item, index, array) => ({
        id: item.queue_item_id,
        title: item.media_title,
        artist: item.media_artist,
        album: item.media_album_name,
        artworkUrl: item.media_image,
        isFirst: index === 0,
        isLast: index === array.length - 1,
        playlistIndex: index,
        isPlaying: player.title === item.media_title,
        skipToItem: () => skipToItem(item.queue_item_id),
        deleteItem: () => deleteItem(item.queue_item_id),
        moveItemUp: () => moveItemUp(item.queue_item_id),
        moveItemDown: () => moveItemDown(item.queue_item_id),
      })) || [];

    // return all items that come after the currently playing item
    // some bug in mass queue returns items before the currently playing item
    // even with limit_before set to 0
    const isPlayingIndex = items.findIndex(item => item.isPlaying);
    return items.slice(isPlayingIndex >= 0 ? isPlayingIndex : 0);
  }, [data, skipToItem, deleteItem, moveItemUp, moveItemDown, player.title]);

  useEffect(() => {
    if (!data) return;
    refetch();
  }, [player.title]);

  return useMemo(
    () => ({ queue, loading, error, refetch, clearQueue }),
    [queue, loading, error, refetch, clearQueue]
  );
};
