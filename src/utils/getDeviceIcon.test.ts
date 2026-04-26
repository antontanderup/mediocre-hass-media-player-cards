import { getDeviceIcon } from "./getDeviceIcon";

describe("getDeviceIcon", () => {
  it("returns the custom icon when provided", () => {
    expect(getDeviceIcon({ icon: "mdi:custom", deviceClass: "speaker" })).toBe(
      "mdi:custom"
    );
  });

  it("returns speaker icon for deviceClass speaker", () => {
    expect(getDeviceIcon({ deviceClass: "speaker" })).toBe("mdi:speaker");
  });

  it("returns receiver icon for deviceClass receiver", () => {
    expect(getDeviceIcon({ deviceClass: "receiver" })).toBe("mdi:audio-video");
  });

  it("returns default speaker icon for unknown deviceClass", () => {
    expect(getDeviceIcon({ deviceClass: "tv" })).toBe("mdi:speaker");
  });

  it("returns default speaker icon when no arguments are provided", () => {
    expect(getDeviceIcon({})).toBe("mdi:speaker");
  });
});
