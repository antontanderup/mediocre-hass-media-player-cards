import { getHasMediaBrowserEntryArray } from "./getMediaBrowserEntryArray";

describe("getHasMediaBrowserEntryArray", () => {
  it("returns an array as-is when mediaBrowser is already an array", () => {
    const entries = [
      { entity_id: "media_player.a" },
      { entity_id: "media_player.b" },
    ];
    expect(
      getHasMediaBrowserEntryArray(entries, "media_player.fallback")
    ).toEqual(entries);
  });

  it("wraps legacy entry in array using its entity_id", () => {
    const result = getHasMediaBrowserEntryArray(
      { entity_id: "media_player.legacy" },
      "media_player.fallback"
    );
    expect(result).toEqual([{ entity_id: "media_player.legacy" }]);
  });

  it("falls back to fallbackEntityId when legacy entry has no entity_id", () => {
    const result = getHasMediaBrowserEntryArray(
      { enabled: true },
      "media_player.fallback"
    );
    expect(result).toEqual([{ entity_id: "media_player.fallback" }]);
  });

  it("falls back to fallbackEntityId when mediaBrowser is undefined", () => {
    const result = getHasMediaBrowserEntryArray(
      undefined,
      "media_player.fallback"
    );
    expect(result).toEqual([{ entity_id: "media_player.fallback" }]);
  });

  it("falls back to fallbackEntityId when mediaBrowser is null", () => {
    const result = getHasMediaBrowserEntryArray(
      null,
      "media_player.fallback"
    );
    expect(result).toEqual([{ entity_id: "media_player.fallback" }]);
  });
});
