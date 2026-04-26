import { getHasSearch } from "./getHasSearch";

describe("getHasSearch", () => {
  it("returns false when both search and maEntityId are absent", () => {
    expect(getHasSearch(undefined, undefined)).toBe(false);
    expect(getHasSearch(undefined, null)).toBe(false);
  });

  it("returns true when maEntityId is a non-empty string", () => {
    expect(getHasSearch(undefined, "media_player.mass")).toBe(true);
  });

  it("returns false when maEntityId is an empty string", () => {
    expect(getHasSearch(undefined, "")).toBe(false);
  });

  it("returns true when search is a non-empty array", () => {
    expect(getHasSearch([{ entity_id: "media_player.test" }], undefined)).toBe(
      true
    );
  });

  it("returns false when search is an empty array", () => {
    expect(getHasSearch([], undefined)).toBe(false);
  });

  it("returns true when search is a legacy entry with enabled: true", () => {
    expect(getHasSearch({ enabled: true }, undefined)).toBe(true);
  });

  it("returns false when search is a legacy entry with enabled: false", () => {
    expect(getHasSearch({ enabled: false }, undefined)).toBe(false);
  });

  it("returns false when search is a legacy entry with no enabled field", () => {
    expect(getHasSearch({}, undefined)).toBe(false);
  });

  it("maEntityId takes priority over search config", () => {
    expect(getHasSearch({ enabled: false }, "media_player.mass")).toBe(true);
    expect(getHasSearch([], "media_player.mass")).toBe(true);
  });
});
