import { getSupportedFeatures } from "@utils/supportedFeaturesUtils";

describe("getSupportedFeatures", () => {
  const baseAttributes = {
    shuffle: false,
    repeat: "off",
    source: "spotify",
    supported_features: 0,
  };

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
    it("should return true when all conditions are met for shuffle", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: false,
        supported_features: 32768, // SUPPORT_SHUFFLE_SET
      });
      expect(result.supportsShuffle).toBe(true);
    });

    it("should return false when shuffle attribute is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: undefined,
        supported_features: 32768,
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("should return false when supported_features does not include shuffle bit", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: false,
        supported_features: 16384, // Different bit
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("should return false when player is off", () => {
      const result = getSupportedFeatures("off", {
        ...baseAttributes,
        shuffle: false,
        supported_features: 32768,
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("should return false when source is optical", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: false,
        source: "optical",
        supported_features: 32768,
      });
      expect(result.supportsShuffle).toBe(false);
    });

    it("should return false when source is aux (case insensitive)", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        shuffle: false,
        source: "AUX",
        supported_features: 32768,
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
  });

  describe("supportsRepeat", () => {
    it("should return true when all conditions are met for repeat", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: "off",
        supported_features: 262144, // SUPPORT_REPEAT_SET
      });
      expect(result.supportsRepeat).toBe(true);
    });

    it("should return false when repeat attribute is undefined", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: undefined,
        supported_features: 262144,
      });
      expect(result.supportsRepeat).toBe(false);
    });

    it("should return false when supported_features does not include repeat bit", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: "off",
        supported_features: 32768, // Different bit
      });
      expect(result.supportsRepeat).toBe(false);
    });

    it("should return false when player is off", () => {
      const result = getSupportedFeatures("off", {
        ...baseAttributes,
        repeat: "off",
        supported_features: 262144,
      });
      expect(result.supportsRepeat).toBe(false);
    });

    it("should return false when source is optical", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        repeat: "off",
        source: "optical",
        supported_features: 262144,
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

    it("should work with different repeat values", () => {
      const baseFeatures = { ...baseAttributes, supported_features: 262144 };
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
  });

  describe("supportsTogglePlayPause", () => {
    it("should return true when player is not off and has play feature", () => {
      const result = getSupportedFeatures("paused", {
        ...baseAttributes,
        supported_features: 4096, // SUPPORT_PLAY
      });
      expect(result.supportsTogglePlayPause).toBe(true);
    });

    it("should return true when player is not off and has pause feature", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 16384, // SUPPORT_PAUSE
      });
      expect(result.supportsTogglePlayPause).toBe(true);
    });

    it("should return true when player has both play and pause features", () => {
      const result = getSupportedFeatures("playing", {
        ...baseAttributes,
        supported_features: 4096 | 16384, // Both features
      });
      expect(result.supportsTogglePlayPause).toBe(true);
    });

    it("should return false when player is off", () => {
      const result = getSupportedFeatures("off", {
        ...baseAttributes,
        supported_features: 4096,
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
    it("should validate shuffle feature bit (32768)", () => {
      const shuffleAttrs = { ...baseAttributes, shuffle: false };
      // Test that exactly bit 15 (32768) is required
      expect(
        getSupportedFeatures("playing", {
          ...shuffleAttrs,
          supported_features: 32768,
        }).supportsShuffle
      ).toBe(true);
      expect(
        getSupportedFeatures("playing", {
          ...shuffleAttrs,
          supported_features: 32767,
        }).supportsShuffle
      ).toBe(false);
      expect(
        getSupportedFeatures("playing", {
          ...shuffleAttrs,
          supported_features: 65536,
        }).supportsShuffle
      ).toBe(false);
    });

    it("should validate repeat feature bit (262144)", () => {
      const repeatAttrs = { ...baseAttributes, repeat: "off" };
      // Test that exactly bit 18 (262144) is required
      expect(
        getSupportedFeatures("playing", {
          ...repeatAttrs,
          supported_features: 262144,
        }).supportsRepeat
      ).toBe(true);
      expect(
        getSupportedFeatures("playing", {
          ...repeatAttrs,
          supported_features: 262143,
        }).supportsRepeat
      ).toBe(false);
      expect(
        getSupportedFeatures("playing", {
          ...repeatAttrs,
          supported_features: 131072,
        }).supportsRepeat
      ).toBe(false);
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
        supported_features: 32768 | 262144,
      });
      expect(result.supportsShuffle).toBe(true);
      expect(result.supportsRepeat).toBe(true);
    });

    it("should handle null source as empty string", () => {
      const result = getSupportedFeatures("playing", {
        shuffle: false,
        repeat: "off",
        source: null as unknown as string,
        supported_features: 32768 | 262144,
      });
      expect(result.supportsShuffle).toBe(true);
      expect(result.supportsRepeat).toBe(true);
    });
  });
});
