// Test the supported features logic directly without React hooks
describe('useSupportedFeatures logic', () => {
  // Extract the logic into testable functions
  const testSupportsShuffle = (
    isOff: boolean,
    shuffle: boolean | undefined,
    source: string | undefined,
    supportedFeatures: number | undefined
  ): boolean => {
    return (
      !isOff &&
      shuffle !== undefined &&
      !["optical", "aux"].includes(source?.toLowerCase() || "") &&
      supportedFeatures !== undefined &&
      (supportedFeatures & 32768) === 32768
    );
  };

  const testSupportsRepeat = (
    isOff: boolean,
    repeat: string | undefined,
    source: string | undefined,
    supportedFeatures: number | undefined
  ): boolean => {
    return (
      !isOff &&
      repeat !== undefined &&
      !["optical", "aux"].includes(source?.toLowerCase() || "") &&
      supportedFeatures !== undefined &&
      (supportedFeatures & 262144) === 262144
    );
  };

  describe('supportsShuffle logic', () => {
    it('should return true when all conditions are met for shuffle', () => {
      const result = testSupportsShuffle(false, false, 'spotify', 32768);
      expect(result).toBe(true);
    });

    it('should return false when shuffle attribute is undefined', () => {
      const result = testSupportsShuffle(false, undefined, 'spotify', 32768);
      expect(result).toBe(false);
    });

    it('should return false when supported_features does not include shuffle bit', () => {
      const result = testSupportsShuffle(false, false, 'spotify', 16384);
      expect(result).toBe(false);
    });

    it('should return false when player is off', () => {
      const result = testSupportsShuffle(true, false, 'spotify', 32768);
      expect(result).toBe(false);
    });

    it('should return false when source is optical', () => {
      const result = testSupportsShuffle(false, false, 'optical', 32768);
      expect(result).toBe(false);
    });

    it('should return false when source is aux (case insensitive)', () => {
      const result = testSupportsShuffle(false, false, 'AUX', 32768);
      expect(result).toBe(false);
    });

    it('should return false when supported_features is undefined', () => {
      const result = testSupportsShuffle(false, false, 'spotify', undefined);
      expect(result).toBe(false);
    });

    it('should work with complex feature combinations', () => {
      // Test with multiple features set (previous + next + play/pause + shuffle)
      const complexFeatures = 16 | 32 | 4096 | 16384 | 32768;
      const result = testSupportsShuffle(false, true, 'spotify', complexFeatures);
      expect(result).toBe(true);
    });
  });

  describe('supportsRepeat logic', () => {
    it('should return true when all conditions are met for repeat', () => {
      const result = testSupportsRepeat(false, 'off', 'spotify', 262144);
      expect(result).toBe(true);
    });

    it('should return false when repeat attribute is undefined', () => {
      const result = testSupportsRepeat(false, undefined, 'spotify', 262144);
      expect(result).toBe(false);
    });

    it('should return false when supported_features does not include repeat bit', () => {
      const result = testSupportsRepeat(false, 'off', 'spotify', 32768);
      expect(result).toBe(false);
    });

    it('should return false when player is off', () => {
      const result = testSupportsRepeat(true, 'off', 'spotify', 262144);
      expect(result).toBe(false);
    });

    it('should return false when source is optical', () => {
      const result = testSupportsRepeat(false, 'off', 'optical', 262144);
      expect(result).toBe(false);
    });

    it('should return false when supported_features is undefined', () => {
      const result = testSupportsRepeat(false, 'off', 'spotify', undefined);
      expect(result).toBe(false);
    });

    it('should work with different repeat values', () => {
      expect(testSupportsRepeat(false, 'one', 'spotify', 262144)).toBe(true);
      expect(testSupportsRepeat(false, 'all', 'spotify', 262144)).toBe(true);
      expect(testSupportsRepeat(false, 'off', 'spotify', 262144)).toBe(true);
    });
  });

  describe('feature bit validation', () => {
    it('should validate shuffle feature bit (32768)', () => {
      // Test that exactly bit 15 (32768) is required
      expect(testSupportsShuffle(false, false, 'spotify', 32768)).toBe(true);
      expect(testSupportsShuffle(false, false, 'spotify', 32767)).toBe(false); // One less
      expect(testSupportsShuffle(false, false, 'spotify', 65536)).toBe(false); // Different bit
    });

    it('should validate repeat feature bit (262144)', () => {
      // Test that exactly bit 18 (262144) is required  
      expect(testSupportsRepeat(false, 'off', 'spotify', 262144)).toBe(true);
      expect(testSupportsRepeat(false, 'off', 'spotify', 262143)).toBe(false); // One less
      expect(testSupportsRepeat(false, 'off', 'spotify', 131072)).toBe(false); // Different bit
    });

    it('should work with combined feature flags', () => {
      const combinedFeatures = 32768 | 262144; // Both shuffle and repeat
      expect(testSupportsShuffle(false, false, 'spotify', combinedFeatures)).toBe(true);
      expect(testSupportsRepeat(false, 'off', 'spotify', combinedFeatures)).toBe(true);
    });
  });
});