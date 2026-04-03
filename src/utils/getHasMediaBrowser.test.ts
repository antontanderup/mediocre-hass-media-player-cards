import { getHasMediaBrowser } from "./getHasMediaBrowser";

describe("getHasMediaBrowser", () => {
  it("returns false when mediaBrowser is undefined", () => {
    expect(getHasMediaBrowser(undefined)).toBe(false);
  });

  it("returns false when mediaBrowser is null", () => {
    expect(getHasMediaBrowser(null)).toBe(false);
  });

  it("returns true when mediaBrowser is a non-empty array", () => {
    expect(
      getHasMediaBrowser([{ entity_id: "media_player.test" }])
    ).toBe(true);
  });

  it("returns false when mediaBrowser is an empty array", () => {
    expect(getHasMediaBrowser([])).toBe(false);
  });

  it("returns true when mediaBrowser is a legacy entry with enabled: true", () => {
    expect(getHasMediaBrowser({ enabled: true })).toBe(true);
  });

  it("returns false when mediaBrowser is a legacy entry with enabled: false", () => {
    expect(getHasMediaBrowser({ enabled: false })).toBe(false);
  });

  it("returns false when mediaBrowser is a legacy entry with no enabled field", () => {
    expect(getHasMediaBrowser({})).toBe(false);
  });
});
