import { checkSupportsShuffle, checkSupportsRepeat } from '@utils/supportedFeaturesUtils';

// Test the supported features logic directly
describe('useSupportedFeatures utility functions', () => {
  describe('checkSupportsShuffle', () => {
    it('should return true when all conditions are met for shuffle', () => {
      const result = checkSupportsShuffle(false, false, 'spotify', 32768);
      expect(result).toBe(true);
    });

    it('should return false when shuffle attribute is undefined', () => {
      const result = checkSupportsShuffle(false, undefined, 'spotify', 32768);
      expect(result).toBe(false);
    });

    it('should return false when supported_features does not include shuffle bit', () => {
      const result = checkSupportsShuffle(false, false, 'spotify', 16384);
      expect(result).toBe(false);
    });

    it('should return false when player is off', () => {
      const result = checkSupportsShuffle(true, false, 'spotify', 32768);
      expect(result).toBe(false);
    });

    it('should return false when source is optical', () => {
      const result = checkSupportsShuffle(false, false, 'optical', 32768);
      expect(result).toBe(false);
    });

    it('should return false when source is aux (case insensitive)', () => {
      const result = checkSupportsShuffle(false, false, 'AUX', 32768);
      expect(result).toBe(false);
    });

    it('should return false when supported_features is undefined', () => {
      const result = checkSupportsShuffle(false, false, 'spotify', undefined);
      expect(result).toBe(false);
    });

    it('should work with complex feature combinations', () => {
      // Test with multiple features set (previous + next + play/pause + shuffle)
      const complexFeatures = 16 | 32 | 4096 | 16384 | 32768;
      const result = checkSupportsShuffle(false, true, 'spotify', complexFeatures);
      expect(result).toBe(true);
    });
  });

  describe('checkSupportsRepeat', () => {
    it('should return true when all conditions are met for repeat', () => {
      const result = checkSupportsRepeat(false, 'off', 'spotify', 262144);
      expect(result).toBe(true);
    });

    it('should return false when repeat attribute is undefined', () => {
      const result = checkSupportsRepeat(false, undefined, 'spotify', 262144);
      expect(result).toBe(false);
    });

    it('should return false when supported_features does not include repeat bit', () => {
      const result = checkSupportsRepeat(false, 'off', 'spotify', 32768);
      expect(result).toBe(false);
    });

    it('should return false when player is off', () => {
      const result = checkSupportsRepeat(true, 'off', 'spotify', 262144);
      expect(result).toBe(false);
    });

    it('should return false when source is optical', () => {
      const result = checkSupportsRepeat(false, 'off', 'optical', 262144);
      expect(result).toBe(false);
    });

    it('should return false when supported_features is undefined', () => {
      const result = checkSupportsRepeat(false, 'off', 'spotify', undefined);
      expect(result).toBe(false);
    });

    it('should work with different repeat values', () => {
      expect(checkSupportsRepeat(false, 'one', 'spotify', 262144)).toBe(true);
      expect(checkSupportsRepeat(false, 'all', 'spotify', 262144)).toBe(true);
      expect(checkSupportsRepeat(false, 'off', 'spotify', 262144)).toBe(true);
    });
  });

  describe('feature bit validation', () => {
    it('should validate shuffle feature bit (32768)', () => {
      // Test that exactly bit 15 (32768) is required
      expect(checkSupportsShuffle(false, false, 'spotify', 32768)).toBe(true);
      expect(checkSupportsShuffle(false, false, 'spotify', 32767)).toBe(false); // One less
      expect(checkSupportsShuffle(false, false, 'spotify', 65536)).toBe(false); // Different bit
    });

    it('should validate repeat feature bit (262144)', () => {
      // Test that exactly bit 18 (262144) is required  
      expect(checkSupportsRepeat(false, 'off', 'spotify', 262144)).toBe(true);
      expect(checkSupportsRepeat(false, 'off', 'spotify', 262143)).toBe(false); // One less
      expect(checkSupportsRepeat(false, 'off', 'spotify', 131072)).toBe(false); // Different bit
    });

    it('should work with combined feature flags', () => {
      const combinedFeatures = 32768 | 262144; // Both shuffle and repeat
      expect(checkSupportsShuffle(false, false, 'spotify', combinedFeatures)).toBe(true);
      expect(checkSupportsRepeat(false, 'off', 'spotify', combinedFeatures)).toBe(true);
    });
  });
});