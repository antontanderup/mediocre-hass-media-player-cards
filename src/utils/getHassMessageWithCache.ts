import { getHass } from "./getHass";
import type { MessageBase } from "home-assistant-js-websocket";


type HassCacheEntry<T = unknown> = {
  value: T;
  timestamp: number;
  staleTime: number;
};

// A plain cache for request/response pairs with staleTime
let _hassCache: Record<string, HassCacheEntry<unknown>> = {};

/**
 * Generic function to send a message via hass.connection.sendMessagePromise with caching.
 * @param key Unique cache key for the request (stringify your message or use a hash)
 * @param message The message object to send
 * @param options Optional: { forceRefresh: boolean } to bypass cache

 * @param options Optional: { forceRefresh: boolean, staleTime: number (ms) }
 * @returns Promise resolving to the response
 */
export async function getHassMessageWithCache<T = unknown>(
  message: MessageBase,
  options?: { forceRefresh?: boolean; staleTime?: number }
): Promise<T> {
  const key = JSON.stringify(message);
  const staleTime = options?.staleTime ?? 10000; // default 10s
  const entry = _hassCache[key] as HassCacheEntry<T> | undefined;
  const now = Date.now();
  if (
    !options?.forceRefresh &&
    entry &&
    now - entry.timestamp < entry.staleTime
  ) {
    return entry.value;
  }
  const hass = getHass();
  const response = (await hass.connection.sendMessagePromise(message)) as T;
  _hassCache = {
    ..._hassCache,
    [key]: { value: response, timestamp: now, staleTime },
  };
  return response;
}

/**
 * Clear the hass message cache (all or by key)
 * @param key Optional cache key to clear
 */
export function clearHassMessageCache(key?: string) {
  if (key) {
    const { [key]: _, ...rest } = _hassCache;
    _hassCache = rest;
  } else {
    _hassCache = {};
  }
}

/**
 * Access the current cache (readonly, returns values only)
 */
export function getHassMessageCache() {
  return Object.fromEntries(
    Object.entries(_hassCache).map(([k, v]) => [k, v.value])
  ) as Record<string, unknown>;
}
