import { getBrightness, parseColorToRgb, parseColorToHsla } from "./colorUtils";

describe("getBrightness", () => {
  it("returns 0 for black", () => {
    expect(getBrightness([0, 0, 0])).toBe(0);
  });

  it("returns 255 for white", () => {
    expect(getBrightness([255, 255, 255])).toBe(255);
  });

  it("calculates perceived brightness using weighted formula", () => {
    // (255 * 299 + 0 * 587 + 0 * 114) / 1000 = 76.245
    expect(getBrightness([255, 0, 0])).toBeCloseTo(76.245, 2);
    // (0 * 299 + 255 * 587 + 0 * 114) / 1000 = 149.685
    expect(getBrightness([0, 255, 0])).toBeCloseTo(149.685, 2);
    // (0 * 299 + 0 * 587 + 255 * 114) / 1000 = 29.07
    expect(getBrightness([0, 0, 255])).toBeCloseTo(29.07, 2);
  });
});

describe("parseColorToRgb", () => {
  it("parses a named color", () => {
    const result = parseColorToRgb("red");
    expect(result).not.toBeNull();
    expect(result![0]).toBe(255);
    expect(result![1]).toBe(0);
    expect(result![2]).toBe(0);
  });

  it("parses a hex color", () => {
    const result = parseColorToRgb("#ffffff");
    expect(result).not.toBeNull();
    expect(result![0]).toBe(255);
    expect(result![1]).toBe(255);
    expect(result![2]).toBe(255);
  });

  it("parses an rgb string", () => {
    const result = parseColorToRgb("rgb(100, 150, 200)");
    expect(result).not.toBeNull();
    expect(result![0]).toBe(100);
    expect(result![1]).toBe(150);
    expect(result![2]).toBe(200);
  });

  it("returns null for invalid color strings", () => {
    const result = parseColorToRgb("not-a-color");
    expect(result).toBeNull();
  });
});

describe("parseColorToHsla", () => {
  it("parses red to HSLA", () => {
    const result = parseColorToHsla("red");
    expect(result).not.toBeNull();
    expect(result![0]).toBe(0); // hue
    expect(result![1]).toBe(100); // saturation 100%
    expect(result![2]).toBe(50); // lightness 50%
  });

  it("parses white to HSLA", () => {
    const result = parseColorToHsla("#ffffff");
    expect(result).not.toBeNull();
    expect(result![2]).toBe(100); // lightness 100%
  });

  it("parses black to HSLA", () => {
    const result = parseColorToHsla("#000000");
    expect(result).not.toBeNull();
    expect(result![2]).toBe(0); // lightness 0%
  });

  it("returns null for invalid color strings", () => {
    const result = parseColorToHsla("not-a-color");
    expect(result).toBeNull();
  });
});
