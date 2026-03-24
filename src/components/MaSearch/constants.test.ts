import { getMaFilterConfig } from "./constants";

describe("getMaFilterConfig", () => {
  it("returns default filters when no config is provided", () => {
    const result = getMaFilterConfig();

    expect(result[0]).toEqual({
      type: "all",
      label: "All",
      icon: "mdi:all-inclusive",
    });
    expect(result.some(filter => filter.type === "track")).toBe(true);
  });

  it("maps configured MA search media types and preserves labels/icons", () => {
    const result = getMaFilterConfig([
      {
        media_type: "tracks",
        name: "Songs",
        icon: "mdi:music",
      },
      {
        media_type: "albums",
      },
    ]);

    expect(result).toEqual([
      {
        type: "all",
        label: "All",
        icon: "mdi:all-inclusive",
      },
      {
        type: "track",
        label: "Songs",
        icon: "mdi:music",
      },
      {
        type: "album",
        label: "Albums",
        icon: "mdi:album",
      },
    ]);
  });

  it("ignores unsupported media types and duplicate aliases", () => {
    const result = getMaFilterConfig([
      { media_type: "tracks" },
      { media_type: "track" },
      { media_type: "camera" },
    ]);

    expect(result).toEqual([
      {
        type: "all",
        label: "All",
        icon: "mdi:all-inclusive",
      },
      {
        type: "track",
        label: "Tracks",
        icon: "mdi:music-note",
      },
    ]);
  });
});
