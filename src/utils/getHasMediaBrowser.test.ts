import { getHasMediaBrowser } from "./getHasMediaBrowser";

describe("getHasMediaBrowser", () => {
  it("returns false when there is no media browser config and no MA entity", () => {
    expect(getHasMediaBrowser(undefined)).toBe(false);
  });

  it("returns true when there is no media browser config but an MA entity exists", () => {
    expect(getHasMediaBrowser(undefined, "media_player.ma_player")).toBe(true);
  });

  it("returns false when media_browser is explicitly disabled as an empty array", () => {
    expect(getHasMediaBrowser([], "media_player.ma_player")).toBe(false);
  });

  it("returns false when legacy media_browser is explicitly disabled", () => {
    expect(
      getHasMediaBrowser(
        {
          enabled: false,
        },
        "media_player.ma_player"
      )
    ).toBe(false);
  });

  it("returns true when legacy media_browser is enabled", () => {
    expect(
      getHasMediaBrowser(
        {
          enabled: true,
        },
        "media_player.ma_player"
      )
    ).toBe(true);
  });
});
