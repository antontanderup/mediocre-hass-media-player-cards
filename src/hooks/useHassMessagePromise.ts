import { useCallback, useEffect, useState, useMemo } from "preact/hooks";
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
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Internal fetch for initial load and cache-aware updates
  const fetch = useCallback(
    async (overrideOptions?: { forceRefresh?: boolean; staleTime?: number; enabled?: boolean }) => {
      if (!message || options?.enabled === false || overrideOptions?.enabled === false || loading) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getHassMessageWithCache<{ response?: T}>(
          message,
          { ...options, ...overrideOptions }
        );
        setData(result?.response ?? null);
        setLoading(false);
        setError(null);
        return result;
      } catch (e: any) {
        setError(e?.message || "Unknown error");
        setLoading(false);
        setData(null);
        return null;
      }
    },
    [message, options, loading]
  );

  // Refetch always forces refresh
  const refetch = useCallback(() => fetch({ forceRefresh: true }), [fetch]);

  useEffect(() => {
    if (message && options?.enabled !== false) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(message), options?.staleTime, options?.enabled]);

  return useMemo(
    () => ({ data, loading, error, refetch }),
    [data, loading, error, refetch]
  );
}
