import { getMediaPlaceholderText } from "./getMediaPlaceholderText";

describe("getMediaPlaceholderText", () => {
  it("returns empty text for blank input", () => {
    expect(getMediaPlaceholderText("")).toBe("");
    expect(getMediaPlaceholderText("   ")).toBe("");
    expect(getMediaPlaceholderText(undefined)).toBe("");
  });

  it("creates initials from multi-word values", () => {
    expect(getMediaPlaceholderText("Alan Jackson")).toBe("AJ");
    expect(getMediaPlaceholderText("10,000 Maniacs")).toBe("1M");
  });

  it("creates a two-letter fallback from single tokens", () => {
    expect(getMediaPlaceholderText("ABBA")).toBe("AB");
    expect(getMediaPlaceholderText("AC/DC")).toBe("AD");
  });
});
