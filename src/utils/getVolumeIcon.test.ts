import { getVolumeIcon } from "./getVolumeIcon";

describe("getVolumeIcon", () => {
  it("returns volume-off when muted", () => {
    expect(getVolumeIcon(0.8, true)).toBe("mdi:volume-off");
  });

  it("returns volume-off when volume is 0", () => {
    expect(getVolumeIcon(0, false)).toBe("mdi:volume-off");
  });

  it("returns volume-off when volume is 0 and muted", () => {
    expect(getVolumeIcon(0, true)).toBe("mdi:volume-off");
  });

  it("returns volume-medium when volume is below 0.5", () => {
    expect(getVolumeIcon(0.1, false)).toBe("mdi:volume-medium");
    expect(getVolumeIcon(0.49, false)).toBe("mdi:volume-medium");
  });

  it("returns volume-high when volume is exactly 0.5", () => {
    expect(getVolumeIcon(0.5, false)).toBe("mdi:volume-high");
  });

  it("returns volume-high when volume is above 0.5", () => {
    expect(getVolumeIcon(0.75, false)).toBe("mdi:volume-high");
    expect(getVolumeIcon(1, false)).toBe("mdi:volume-high");
  });
});
