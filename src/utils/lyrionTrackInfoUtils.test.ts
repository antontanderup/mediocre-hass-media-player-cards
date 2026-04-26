import { deriveLyrionTrackBadges } from "./lyrionTrackInfoUtils";

describe("deriveLyrionTrackBadges", () => {
  describe("audioBadges", () => {
    it("returns empty array when track has no audio metadata", () => {
      const { audioBadges } = deriveLyrionTrackBadges({});
      expect(audioBadges).toHaveLength(0);
    });

    it("uppercases type", () => {
      const { audioBadges } = deriveLyrionTrackBadges({ type: "mp3" });
      expect(audioBadges).toContain("MP3");
    });

    it("includes Lossless badge when lossless is '1'", () => {
      const { audioBadges } = deriveLyrionTrackBadges({ lossless: "1" });
      expect(audioBadges).toContain("Lossless");
    });

    it("omits Lossless badge when lossless is '0'", () => {
      const { audioBadges } = deriveLyrionTrackBadges({ lossless: "0" });
      expect(audioBadges).not.toContain("Lossless");
    });

    it("converts samplerate from Hz to kHz", () => {
      const { audioBadges } = deriveLyrionTrackBadges({ samplerate: "44100" });
      expect(audioBadges).toContain("44.1 kHz");
    });

    it("formats samplesize with -bit suffix", () => {
      const { audioBadges } = deriveLyrionTrackBadges({ samplesize: "24" });
      expect(audioBadges).toContain("24-bit");
    });

    it("includes bitrate when present and non-zero", () => {
      const { audioBadges } = deriveLyrionTrackBadges({
        bitrate: "256kbps CBR",
      });
      expect(audioBadges).toContain("256kbps CBR");
    });

    it("omits bitrate when value is '0'", () => {
      const { audioBadges } = deriveLyrionTrackBadges({ bitrate: "0" });
      expect(audioBadges.some(b => b.includes("kbps") || b === "0")).toBe(
        false
      );
    });
  });

  describe("fileSize formatting", () => {
    it("formats bytes under 1 MB as rounded KB", () => {
      const { audioBadges } = deriveLyrionTrackBadges({ filesize: "512000" });
      expect(audioBadges).toContain("500 KB");
    });

    it("formats bytes at or above 1 MB with one decimal place", () => {
      const { audioBadges } = deriveLyrionTrackBadges({ filesize: "1572864" });
      expect(audioBadges).toContain("1.5 MB");
    });

    it("omits file size when filesize is '0'", () => {
      const { audioBadges } = deriveLyrionTrackBadges({ filesize: "0" });
      expect(audioBadges.some(b => b.endsWith("KB") || b.endsWith("MB"))).toBe(
        false
      );
    });

    it("omits file size when filesize is absent", () => {
      const { audioBadges } = deriveLyrionTrackBadges({});
      expect(audioBadges.some(b => b.endsWith("KB") || b.endsWith("MB"))).toBe(
        false
      );
    });
  });

  describe("metaBadges", () => {
    it("returns empty array when track has no meta", () => {
      const { metaBadges } = deriveLyrionTrackBadges({});
      expect(metaBadges).toHaveLength(0);
    });

    it("includes genre", () => {
      const { metaBadges } = deriveLyrionTrackBadges({ genre: "Rock" });
      expect(metaBadges).toContain("Rock");
    });

    it("includes year", () => {
      const { metaBadges } = deriveLyrionTrackBadges({ year: "1994" });
      expect(metaBadges).toContain("1994");
    });

    it("formats playcount as 'N plays'", () => {
      const { metaBadges } = deriveLyrionTrackBadges({ playcount: "12" });
      expect(metaBadges).toContain("12 plays");
    });
  });

  describe("trackPosition", () => {
    it("omits track position when tracknum is absent", () => {
      const { metaBadges } = deriveLyrionTrackBadges({});
      expect(metaBadges.some(b => b.startsWith("Track"))).toBe(false);
    });

    it("formats track number alone", () => {
      const { metaBadges } = deriveLyrionTrackBadges({ tracknum: "5" });
      expect(metaBadges).toContain("Track 5");
    });

    it("includes disc number when disc is present without disccount", () => {
      const { metaBadges } = deriveLyrionTrackBadges({
        tracknum: "3",
        disc: "2",
      });
      expect(metaBadges).toContain("Disc 2 · Track 3");
    });

    it("includes disc/disccount fraction when both are present", () => {
      const { metaBadges } = deriveLyrionTrackBadges({
        tracknum: "3",
        disc: "2",
        disccount: "3",
      });
      expect(metaBadges).toContain("Disc 2/3 · Track 3");
    });

    it("omits disc prefix when disc is absent", () => {
      const { metaBadges } = deriveLyrionTrackBadges({
        tracknum: "7",
        disccount: "2",
      });
      expect(metaBadges).toContain("Track 7");
      expect(metaBadges.some(b => b.includes("Disc"))).toBe(false);
    });
  });
});
