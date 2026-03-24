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
});
