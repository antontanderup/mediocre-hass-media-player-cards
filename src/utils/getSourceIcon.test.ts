import { getSourceIcon } from "./getSourceIcon";

describe("getSourceIcon", () => {
  it.each([
    ["Spotify", "mdi:spotify"],
    ["spotify", "mdi:spotify"],
    ["AirPlay", "mdi:cast-audio-variant"],
    ["airplay", "mdi:cast-audio-variant"],
    ["Bluetooth", "mdi:bluetooth"],
    ["bluetooth", "mdi:bluetooth"],
    ["Net Radio", "mdi:radio"],
    ["net radio", "mdi:radio"],
    ["Server", "mdi:server"],
    ["server", "mdi:server"],
    ["USB", "mdi:usb"],
    ["usb", "mdi:usb"],
    ["AUX", "mdi:audio-input-rca"],
    ["aux", "mdi:audio-input-rca"],
    ["HDMI", "mdi:hdmi-port"],
    ["hdmi", "mdi:hdmi-port"],
    ["TV", "mdi:television"],
    ["tv", "mdi:television"],
    ["Tuner", "mdi:radio-tower"],
    ["tuner", "mdi:radio-tower"],
    ["Optical", "mdi:audio-input-stereo-minijack"],
    ["optical", "mdi:audio-input-stereo-minijack"],
  ])("returns correct icon for source %s", (source, expected) => {
    expect(getSourceIcon({ source })).toBe(expected);
  });

  it("returns default mdi:music for unknown source", () => {
    expect(getSourceIcon({ source: "Unknown Source" })).toBe("mdi:music");
  });

  it("returns custom fallback icon for unknown source", () => {
    expect(
      getSourceIcon({ source: "Unknown Source", fallbackIcon: "mdi:custom" })
    ).toBe("mdi:custom");
  });
});
