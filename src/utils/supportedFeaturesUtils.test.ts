import { getSupportedFeatures } from "./supportedFeaturesUtils";

// Feature bit flags
const FEATURE_PAUSE = 1;
const FEATURE_PREVIOUS_TRACK = 16;
const FEATURE_NEXT_TRACK = 32;
const FEATURE_STOP = 4096;
const FEATURE_PLAY = 16384;
const FEATURE_SHUFFLE = 32768;
const FEATURE_REPEAT = 262144;

const ALL_FEATURES =
  FEATURE_PAUSE |
  FEATURE_PREVIOUS_TRACK |
  FEATURE_NEXT_TRACK |
  FEATURE_STOP |
  FEATURE_PLAY |
  FEATURE_SHUFFLE |
  FEATURE_REPEAT;

describe("getSupportedFeatures", () => {
  describe("when state is off", () => {
    it("returns all false when player is off", () => {
      const result = getSupportedFeatures("off", {
        supported_features: ALL_FEATURES,
        shuffle: true,
        repeat: "all",
      });
      expect(result.supportPreviousTrack).toBe(false);
      expect(result.supportNextTrack).toBe(false);
      expect(result.supportsTogglePlayPause).toBe(false);
      expect(result.supportsStop).toBe(false);
      expect(result.supportsShuffle).toBe(false);
      expect(result.supportsRepeat).toBe(false);
    });
  });

  describe("previous/next track", () => {
    it("supports previous track when bit 16 is set", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PREVIOUS_TRACK,
      });
      expect(result.supportPreviousTrack).toBe(true);
    });

    it("does not support previous track when bit 16 is missing", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_NEXT_TRACK,
      });
      expect(result.supportPreviousTrack).toBe(false);
    });

    it("supports next track when bit 32 is set", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_NEXT_TRACK,
      });
      expect(result.supportNextTrack).toBe(true);
    });

    it("does not support next track when bit 32 is missing", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PREVIOUS_TRACK,
      });
      expect(result.supportNextTrack).toBe(false);
    });
  });

  describe("play/pause", () => {
    it("supports toggle play/pause via PAUSE bit (1)", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PAUSE,
      });
      expect(result.supportsTogglePlayPause).toBe(true);
    });

    it("supports toggle play/pause via PLAY+STOP bits", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PLAY | FEATURE_STOP,
      });
      expect(result.supportsTogglePlayPause).toBe(true);
    });

    it("does not support toggle play/pause when PLAY is set but not PAUSE or STOP", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PLAY,
      });
      expect(result.supportsTogglePlayPause).toBe(false);
    });

    it("does not support toggle play/pause when neither bit is set", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_NEXT_TRACK,
      });
      expect(result.supportsTogglePlayPause).toBe(false);
    });

    it("supportsPause is true only when PAUSE bit is set", () => {
      const withPause = getSupportedFeatures("playing", {
        supported_features: FEATURE_PAUSE,
      });
      expect(withPause.supportsPause).toBe(true);

      const playOnly = getSupportedFeatures("playing", {
        supported_features: FEATURE_PLAY,
      });
      expect(playOnly.supportsPause).toBe(false);
    });

    it("supportsPause is false when player is off", () => {
      const result = getSupportedFeatures("off", {
        supported_features: FEATURE_PAUSE,
      });
      expect(result.supportsPause).toBe(false);
    });

    it("HEOS-like player (PLAY+STOP, no PAUSE) has supportsTogglePlayPause true but supportsPause false", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PLAY | FEATURE_STOP,
      });
      expect(result.supportsTogglePlayPause).toBe(true);
      expect(result.supportsPause).toBe(false);
      expect(result.supportsStop).toBe(true);
    });
  });

  describe("stop", () => {
    it("supports stop when bit 4096 is set", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_STOP,
      });
      expect(result.supportsStop).toBe(true);
    });

    it("does not support stop when bit 4096 is missing", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PAUSE,
      });
      expect(result.supportsStop).toBe(false);
    });
  });

  describe("shuffle", () => {
    it("supports shuffle when conditions are met", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PAUSE | FEATURE_SHUFFLE,
        shuffle: false,
      });
      expect(result.supportsShuffle).toBe(true);
    });

    it("does not support shuffle when shuffle attribute is undefined", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PAUSE | FEATURE_SHUFFLE,
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("does not support shuffle when player cannot play/pause or stop", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_SHUFFLE,
        shuffle: true,
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("supports shuffle when stop is supported but not play/pause", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_STOP | FEATURE_SHUFFLE,
        shuffle: true,
      });
      expect(result.supportsShuffle).toBe(true);
    });
  });

  describe("repeat", () => {
    it("supports repeat when conditions are met", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PAUSE | FEATURE_REPEAT,
        repeat: "all",
      });
      expect(result.supportsRepeat).toBe(true);
    });

    it("does not support repeat when repeat attribute is undefined", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_PAUSE | FEATURE_REPEAT,
      });
      expect(result.supportsRepeat).toBe(false);
    });

    it("does not support repeat when player cannot play/pause or stop", () => {
      const result = getSupportedFeatures("playing", {
        supported_features: FEATURE_REPEAT,
        repeat: "off",
      });
      expect(result.supportsRepeat).toBe(false);
    });
  });

  it("returns all false when supported_features is undefined", () => {
    const result = getSupportedFeatures("playing", {
      shuffle: true,
      repeat: "all",
    });
    expect(result.supportPreviousTrack).toBe(false);
    expect(result.supportNextTrack).toBe(false);
    expect(result.supportsTogglePlayPause).toBe(false);
    expect(result.supportsStop).toBe(false);
    expect(result.supportsShuffle).toBe(false);
    expect(result.supportsRepeat).toBe(false);
  });
});
