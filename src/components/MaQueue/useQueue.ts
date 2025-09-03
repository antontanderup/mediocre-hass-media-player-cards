import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getHass } from "@utils";
import { MaQueueItem, MaQueueResponse } from "./types";

export const useQueue = (entityId: string) => {
  const [queue, setQueue] = useState<MaQueueResponse>([]);
  const [loading, setLoading] = useState(false);

  const fetchQueue = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);

    const hass = getHass();
    try {
      if (!hass.services?.mass_queue?.get_queue_items) {
        throw new Error("Service mass_queue.get_queue_items not found");
      }

      const message = {
        type: "call_service",
        domain: "mass_queue",
        service: "get_queue_items",
        service_data: {
          entity: entityId,
        },
        return_response: true,
      };

      const res = await hass.connection.sendMessagePromise(message);
      const response = res as { response: Record<string, MaQueueItem[]> };
      const items = response.response?.[entityId] ?? [];
      setQueue(items);
    } catch (e) {
      console.error("Error fetching queue items:", e);
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const callService = useCallback(
    async (service: string, queueItemId: string) => {
      const hass = getHass();
      try {
        await hass.callService("mass_queue", service, {
          entity: entityId,
          queue_item_id: queueItemId,
        });
        await fetchQueue();
      } catch (e) {
        console.error(`Error calling ${service}:`, e);
      }
    },
    [entityId, fetchQueue]
  );

  const removeQueueItem = useCallback(
    async (id: string) => callService("remove_queue_item", id),
    [callService]
  );
  const playQueueItem = useCallback(
    async (id: string) => callService("play_queue_item", id),
    [callService]
  );
  const moveQueueItemUp = useCallback(
    async (id: string) => callService("move_queue_item_up", id),
    [callService]
  );
  const moveQueueItemDown = useCallback(
    async (id: string) => callService("move_queue_item_down", id),
    [callService]
  );
  const moveQueueItemNext = useCallback(
    async (id: string) => callService("move_queue_item_next", id),
    [callService]
  );

  return useMemo(
    () => ({
      queue,
      loading,
      removeQueueItem,
      playQueueItem,
      moveQueueItemUp,
      moveQueueItemDown,
      moveQueueItemNext,
    }),
    [
      queue,
      loading,
      removeQueueItem,
      playQueueItem,
      moveQueueItemUp,
      moveQueueItemDown,
      moveQueueItemNext,
    ]
  );
};
