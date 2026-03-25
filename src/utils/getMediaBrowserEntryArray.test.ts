import { getHasMediaBrowserEntryArray } from "./getMediaBrowserEntryArray";

describe("getHasMediaBrowserEntryArray", () => {
  it("returns array configs unchanged", () => {
    const config = [
      {
        entity_id: "media_player.browser",
        name: "Browser",
        media_types: [{ media_type: "artists" }],
      },
    ];

    expect(
      getHasMediaBrowserEntryArray(config, "media_player.fallback")
    ).toEqual(config);
  });

  it("converts legacy config to an entry array and preserves media_types", () => {
    expect(
      getHasMediaBrowserEntryArray(
        {
          enabled: true,
          entity_id: "media_player.browser",
          media_types: [{ media_type: "playlists", name: "Playlists" }],
        },
        "media_player.fallback"
      )
    ).toEqual([
      {
        entity_id: "media_player.browser",
        media_types: [{ media_type: "playlists", name: "Playlists" }],
      },
    ]);
  });

  it("infers the MA entity when media_browser is omitted", () => {
    expect(
      getHasMediaBrowserEntryArray(
        undefined,
        "media_player.fallback",
        "media_player.ma_player"
      )
    ).toEqual([
      {
        entity_id: "media_player.ma_player",
      },
    ]);
  });

  it("prefers the MA entity over the fallback entity for legacy config without entity_id", () => {
    expect(
      getHasMediaBrowserEntryArray(
        {
          enabled: true,
          media_types: [{ media_type: "artists" }],
        },
        "media_player.fallback",
        "media_player.ma_player"
      )
    ).toEqual([
      {
        entity_id: "media_player.ma_player",
        media_types: [{ media_type: "artists" }],
      },
    ]);
  });
});
