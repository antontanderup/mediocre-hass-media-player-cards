import { getHassMessageWithCache, clearHassMessageCache, getHassMessageCache } from "./getHassMessageWithCache";

// Mock getHass and hass.connection.sendMessagePromise
let callCounter = 0;
jest.mock("./getHass", () => ({
  getHass: () => ({
    connection: {
      sendMessagePromise: jest.fn(async (msg) => {
        callCounter++;
        return { result: `response-for-${JSON.stringify(msg)}-call-${callCounter}` };
      }),
    },
  }),
}));

describe("getHassMessageWithCache", () => {
  beforeEach(() => {
    clearHassMessageCache();
    jest.clearAllMocks();
    callCounter = 0;
  });

  it("returns a response and caches it", async () => {
    const message = { type: "test", foo: 1 };
    const result1 = await getHassMessageWithCache(message);
    const result2 = await getHassMessageWithCache(message);
    expect(result1).toEqual(result2);
    const cacheKey = JSON.stringify(message);
    expect(getHassMessageCache()[cacheKey]).toEqual(result1);
  });

  it("respects forceRefresh option", async () => {
    const message = { type: "refresh", bar: 2 };
    const result1 = await getHassMessageWithCache(message);
    const result2 = await getHassMessageWithCache(message, { forceRefresh: true });
    expect(result1).not.toEqual(result2);
  });

  it("respects staleTime option", async () => {
    const message = { type: "stale", baz: 3 };
    const result1 = await getHassMessageWithCache(message, { staleTime: 10 });
    // Wait for cache to become stale
    await new Promise(res => setTimeout(res, 20));
    const result2 = await getHassMessageWithCache(message, { staleTime: 10 });
    expect(result1).not.toEqual(result2);
  });

  it("returns cached value if not stale", async () => {
    const message = { type: "fresh", qux: 4 };
    const result1 = await getHassMessageWithCache(message, { staleTime: 1000 });
    const result2 = await getHassMessageWithCache(message, { staleTime: 1000 });
    expect(result1).toEqual(result2);
  });

  it("can clear cache by key", async () => {
    const key = "clear-key";
    const message = { type: "clear", val: 5 };
    await getHassMessageWithCache(message);
    clearHassMessageCache(key);
    expect(getHassMessageCache()[key]).toBeUndefined();
  });

  it("can clear all cache", async () => {
    await getHassMessageWithCache({ type: "a" });
    await getHassMessageWithCache({ type: "b" });
    clearHassMessageCache();
    expect(Object.keys(getHassMessageCache())).toHaveLength(0);
  });
});
