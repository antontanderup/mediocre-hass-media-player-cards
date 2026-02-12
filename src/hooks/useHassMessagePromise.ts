import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "preact/hooks";
import type { MessageBase } from "home-assistant-js-websocket";
import { getHassMessageWithCache } from "@utils/getHassMessageWithCache";

/**
 * useHassMessagePromise - React hook for sending Home Assistant messages with caching and loading/error state.
 * @param message The message object to send (MessageBase)
 * @param options Optional: { forceRefresh, staleTime }
 * @returns { data, loading, error, refetch }
 */
export function useHassMessagePromise<T = unknown>(
  message: MessageBase | null,
  options?: { forceRefresh?: boolean; staleTime?: number; enabled?: boolean }
) {
  // Store data keyed to the message that produced it so stale results
  // from a previous query are never exposed to consumers.
  const [keyedData, setKeyedData] = useState<{
    key: string;
    value: T | null;
  }>({ key: "", value: null });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messageKey = useMemo(
    () => (message ? JSON.stringify(message) : ""),
    [message]
  );
  const data = keyedData.key === messageKey ? keyedData.value : null;

  // Ref to track the latest message key (for race-condition guard in async fetch)
  const latestMessageKeyRef = useRef<string>("");

  // Internal fetch for initial load and cache-aware updates
  const fetch = useCallback(
    async (overrideOptions?: {
      forceRefresh?: boolean;
      staleTime?: number;
      enabled?: boolean;
    }) => {
      if (
        !message ||
        options?.enabled === false ||
        overrideOptions?.enabled === false
      )
        return;
      const messageKey = JSON.stringify(message);
      latestMessageKeyRef.current = messageKey;
      setLoading(true);
      setError(null);
      try {
        const result = await getHassMessageWithCache<{ response?: T }>(
          message,
          { ...options, ...overrideOptions }
        );
        // Only update state if this is the latest message
        if (latestMessageKeyRef.current === messageKey) {
          setKeyedData({ key: messageKey, value: result?.response ?? null });
          setLoading(false);
          setError(null);
        }
        return result;
      } catch (e: unknown | { message?: string }) {
        if (latestMessageKeyRef.current === messageKey) {
          setError(
            e && typeof e === "object" && "message" in e
              ? (e as Error).message
              : "Unknown error"
          );
          setLoading(false);
          setKeyedData({ key: messageKey, value: null });
        }
        return null;
      }
    },
    [message, options, loading]
  );

  // Refetch always forces refresh
  const refetch = useCallback(() => fetch({ forceRefresh: true }), [fetch]);

  useEffect(() => {
    if (message && options?.enabled !== false) fetch();
  }, [JSON.stringify(message), options?.staleTime, options?.enabled]);

  return useMemo(
    () => ({ data, loading, error, refetch }),
    [data, loading, error, refetch]
  );
}
