import { getSupportedFeatures } from "@utils/supportedFeaturesUtils";

describe("getSupportedFeatures", () => {
  const baseAttributes = {
    shuffle: false,
    repeat: "off",
    source: "spotify",
    supported_features: 0,
  };

  describe("supportsStop", () => {
    it("should return true when player is not off and has stop feature", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 4096, // SUPPORT_STOP
      });
      expect(result.supportsStop).toBe(true);
    });

    it("should return false when player is off", () => {
      const result = getSupportedFeatures("off", {
        ...baseAttributes,
        supported_features: 4096,
      });
      expect(result.supportsStop).toBe(false);
    });

    it("should return false when supported_features is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: undefined,
      });
      expect(result.supportsStop).toBe(false);
    });

    it("should return false when stop feature bit is not set", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 32, // Different bit
      });
      expect(result.supportsStop).toBe(false);
    });
  });

  describe("supportPreviousTrack", () => {
    it("should return true when player is not off and has previous track feature", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 16, // SUPPORT_PREVIOUS_TRACK
      });
      expect(result.supportPreviousTrack).toBe(true);
    });

    it("should return false when player is off", () => {
      const result = getSupportedFeatures("off", {
        ...baseAttributes,
        supported_features: 16,
      });
      expect(result.supportPreviousTrack).toBe(false);
    });

    it("should return false when supported_features is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: undefined,
      });
      expect(result.supportPreviousTrack).toBe(false);
    });

    it("should return false when feature bit is not set", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 8, // Different bit
      });
      expect(result.supportPreviousTrack).toBe(false);
    });
  });

  describe("supportNextTrack", () => {
    it("should return true when player is not off and has next track feature", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 32, // SUPPORT_NEXT_TRACK
      });
      expect(result.supportNextTrack).toBe(true);
    });

    it("should return false when player is off", () => {
      const result = getSupportedFeatures("off", {
        ...baseAttributes,
        supported_features: 32,
      });
      expect(result.supportNextTrack).toBe(false);
    });

    it("should return false when supported_features is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: undefined,
      });
      expect(result.supportNextTrack).toBe(false);
    });

    it("should return false when feature bit is not set", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 16, // Different bit
      });
      expect(result.supportNextTrack).toBe(false);
    });
  });

  describe("supportsShuffle", () => {
    it("should return true when all conditions are met for shuffle and stop or togglePlayPause is supported", () => {
      // supportsStop true
      let result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: false,
        supported_features: 32768 | 4096, // SUPPORT_SHUFFLE_SET | SUPPORT_STOP
      });
      expect(result.supportsShuffle).toBe(true);
      // supportsTogglePlayPause true
      result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: false,
        supported_features: 32768 | 16384, // SUPPORT_SHUFFLE_SET | SUPPORT_PAUSE
      });
      expect(result.supportsShuffle).toBe(true);
    });

    it("should return false when shuffle attribute is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: undefined,
        supported_features: 32768 | 4096,
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("should return false when supported_features does not include shuffle bit", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: false,
        supported_features: 16384 | 4096, // No shuffle bit
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("should return false when player is off", () => {
      const result = getSupportedFeatures("off", {
        ...baseAttributes,
        shuffle: false,
        supported_features: 32768 | 4096,
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("should return false when supported_features is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: false,
        supported_features: undefined,
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("should return false if neither stop nor togglePlayPause is supported", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: false,
        supported_features: 32768, // Only shuffle bit
      });
      expect(result.supportsShuffle).toBe(false);
    });
  });

  describe("supportsRepeat", () => {
    it("should return true when all conditions are met for repeat and stop or togglePlayPause is supported", () => {
      // supportsStop true
      let result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: "off",
        supported_features: 262144 | 4096, // SUPPORT_REPEAT_SET | SUPPORT_STOP
      });
      expect(result.supportsRepeat).toBe(true);
      // supportsTogglePlayPause true
      result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: "off",
        supported_features: 262144 | 16384, // SUPPORT_REPEAT_SET | SUPPORT_PAUSE
      });
      expect(result.supportsRepeat).toBe(true);
    });

    it("should return false when repeat attribute is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: undefined,
        supported_features: 262144 | 4096,
      });
      expect(result.supportsRepeat).toBe(false);
    });

    it("should return false when supported_features does not include repeat bit", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: "off",
        supported_features: 32768 | 4096, // No repeat bit
      });
      expect(result.supportsRepeat).toBe(false);
    });

    it("should return false when player is off", () => {
      const result = getSupportedFeatures("off", {
        ...baseAttributes,
        repeat: "off",
        supported_features: 262144 | 4096,
      });
      expect(result.supportsRepeat).toBe(false);
    });

    it("should return false when supported_features is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: "off",
        supported_features: undefined,
      });
      expect(result.supportsRepeat).toBe(false);
    });

    it("should work with different repeat values if stop or togglePlayPause is supported", () => {
      const baseFeatures = { ...baseAttributes, supported_features: 262144 | 4096 };
      expect(
        getSupportedFeatures("playing", { ...baseFeatures, repeat: "one" })
          .supportsRepeat
      ).toBe(true);
      expect(
        getSupportedFeatures("playing", { ...baseFeatures, repeat: "all" })
          .supportsRepeat
      ).toBe(true);
      expect(
        getSupportedFeatures("playing", { ...baseFeatures, repeat: "off" })
          .supportsRepeat
      ).toBe(true);
    });

    it("should return false if neither stop nor togglePlayPause is supported", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: "off",
        supported_features: 262144, // Only repeat bit
      });
      expect(result.supportsRepeat).toBe(false);
    });
  });

  describe("supportsTogglePlayPause", () => {
    it("should return true when player is not off and has pause feature", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 16384, // SUPPORT_PAUSE
      });
      expect(result.supportsTogglePlayPause).toBe(true);
    });

    it("should return false when player is off", () => {
      const result = getSupportedFeatures("off", {
        ...baseAttributes,
        supported_features: 16384,
      });
      expect(result.supportsTogglePlayPause).toBe(false);
    });

    it("should return false when supported_features is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: undefined,
      });
      expect(result.supportsTogglePlayPause).toBe(false);
    });

    it("should return false when neither play nor pause feature bits are set", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 32, // Different bit
      });
      expect(result.supportsTogglePlayPause).toBe(false);
    });
  });

  describe("feature bit validation", () => {
    it("should validate shuffle feature bit (32768) only if stop or togglePlayPause is supported", () => {
      const shuffleAttrs = { ...baseAttributes, shuffle: false };
      // Only shuffle bit, no stop/togglePlayPause
      expect(
        getSupportedFeatures("playing", {
          ...shuffleAttrs,
          supported_features: 32768,
        }).supportsShuffle
      ).toBe(false);
      // Shuffle + stop
      expect(
        getSupportedFeatures("playing", {
          ...shuffleAttrs,
          supported_features: 32768 | 4096,
        }).supportsShuffle
      ).toBe(true);
      // Shuffle + togglePlayPause
      expect(
        getSupportedFeatures("playing", {
          ...shuffleAttrs,
          supported_features: 32768 | 16384,
        }).supportsShuffle
      ).toBe(true);
    });

    it("should validate repeat feature bit (262144) only if stop or togglePlayPause is supported", () => {
      const repeatAttrs = { ...baseAttributes, repeat: "off" };
      // Only repeat bit, no stop/togglePlayPause
      expect(
        getSupportedFeatures("playing", {
          ...repeatAttrs,
          supported_features: 262144,
        }).supportsRepeat
      ).toBe(false);
      // Repeat + stop
      expect(
        getSupportedFeatures("playing", {
          ...repeatAttrs,
          supported_features: 262144 | 4096,
        }).supportsRepeat
      ).toBe(true);
      // Repeat + togglePlayPause
      expect(
        getSupportedFeatures("playing", {
          ...repeatAttrs,
          supported_features: 262144 | 16384,
        }).supportsRepeat
      ).toBe(true);
    });

    it("should work with combined feature flags", () => {
      const combinedFeatures = 16 | 32 | 4096 | 16384 | 32768 | 262144; // All features
      const allAttrs = {
        shuffle: false,
        repeat: "off",
        source: "spotify",
        supported_features: combinedFeatures,
      };
      const result = getSupportedFeatures("playing", allAttrs);

      expect(result.supportPreviousTrack).toBe(true);
      expect(result.supportNextTrack).toBe(true);
      expect(result.supportsShuffle).toBe(true);
      expect(result.supportsRepeat).toBe(true);
      expect(result.supportsTogglePlayPause).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty attributes object", () => {
      const result = getSupportedFeatures("playing", {});
      expect(result.supportPreviousTrack).toBe(false);
      expect(result.supportNextTrack).toBe(false);
      expect(result.supportsShuffle).toBe(false);
      expect(result.supportsRepeat).toBe(false);
      expect(result.supportsTogglePlayPause).toBe(false);
    });

    it("should handle undefined source", () => {
      const result = getSupportedFeatures("playing", {
        shuffle: false,
        repeat: "off",
        source: undefined,
        supported_features: 32768 | 262144 | 4096,
      });
      expect(result.supportsShuffle).toBe(true);
      expect(result.supportsRepeat).toBe(true);
    });

    it("should handle null source as empty string", () => {
      const result = getSupportedFeatures("playing", {
        shuffle: false,
        repeat: "off",
        source: null as unknown as string,
        supported_features: 32768 | 262144 | 4096,
      });
      expect(result.supportsShuffle).toBe(true);
      expect(result.supportsRepeat).toBe(true);
    });
  });
});
