import {
  getDefaultValuesFromConfig,
  getDefaultValuesFromMassiveConfig,
  getSimpleConfigFromFormValues,
  getSimpleConfigFromMassiveFormValues,
} from "@utils/cardConfigUtils";
import {
  MediocreMediaPlayerCardConfig,
  MediocreMassiveMediaPlayerCardConfig,
} from "@types";

// Mock environment variables for tests
const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...OLD_ENV,
    VITE_MEDIA_PLAYER_CARD: "mediocre-media-player-card",
    VITE_MASSIVE_MEDIA_PLAYER_CARD: "mediocre-massive-media-player-card",
  };
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe("cardConfigUtils", () => {
  describe("getDefaultValuesFromConfig", () => {
    it("should preserve grid_options when present", () => {
      const configWithGridOptions: MediocreMediaPlayerCardConfig = {
        type: "custom:mediocre-media-player-card",
        entity_id: "media_player.test",
        grid_options: {
          columns: "full",
          rows: 2,
        },
      };

      const result = getDefaultValuesFromConfig(configWithGridOptions);

      expect(result.grid_options).toEqual({
        columns: "full",
        rows: 2,
      });
    });

    it("should preserve grid_options as undefined when not present", () => {
      const configWithoutGridOptions: MediocreMediaPlayerCardConfig = {
        type: "custom:mediocre-media-player-card",
        entity_id: "media_player.test",
      };

      const result = getDefaultValuesFromConfig(configWithoutGridOptions);

      expect(result.grid_options).toBeUndefined();
    });

    it("should set default values for all fields", () => {
      const minimalConfig: MediocreMediaPlayerCardConfig = {
        type: "custom:mediocre-media-player-card",
        entity_id: "media_player.test",
      };

      const result = getDefaultValuesFromConfig(minimalConfig);

      expect(result.type).toBe("custom:mediocre-media-player-card");
      expect(result.entity_id).toBe("media_player.test");
      expect(result.use_art_colors).toBe(false);
      expect(result.tap_opens_popup).toBe(false);
      expect(result.action).toEqual({});
      expect(result.speaker_group).toEqual({
        entity_id: null,
        entities: [],
      });
      expect(result.search).toEqual({
        enabled: false,
        show_favorites: false,
        entity_id: null,
        media_types: [],
      });
      expect(result.queue).toEqual({
        enabled: false,
      });
      expect(result.ma_entity_id).toBeNull();
      expect(result.custom_buttons).toEqual([]);
      expect(result.options).toEqual({
        always_show_power_button: false,
        always_show_custom_buttons: false,
      });
      expect(result.grid_options).toBeUndefined();
    });

    it("should preserve existing values when present", () => {
      const fullConfig: MediocreMediaPlayerCardConfig = {
        type: "custom:mediocre-media-player-card",
        entity_id: "media_player.test",
        use_art_colors: true,
        tap_opens_popup: true,
        action: { tap_action: { action: "toggle" } },
        speaker_group: {
          entity_id: "media_player.main",
          entities: ["media_player.speaker1", "media_player.speaker2"],
        },
        search: {
          enabled: true,
          show_favorites: true,
          entity_id: "media_player.search",
          media_types: [],
        },
        queue: { enabled: true },
        ma_entity_id: "media_player.ma",
        ma_favorite_button_entity_id: "media_player.ma_favorite",
        custom_buttons: [
          { icon: "mdi:play", name: "Play", tap_action: { action: "toggle" } },
        ],
        options: {
          always_show_power_button: true,
          always_show_custom_buttons: true,
        },
        grid_options: { columns: "full" },
      };

      const result = getDefaultValuesFromConfig(fullConfig);

      expect(result).toEqual(fullConfig);
    });
  });

  describe("getDefaultValuesFromMassiveConfig", () => {
    it("should preserve grid_options when present", () => {
      const configWithGridOptions: MediocreMassiveMediaPlayerCardConfig = {
        type: "custom:mediocre-massive-media-player-card",
        entity_id: "media_player.test",
        mode: "card",
        grid_options: {
          columns: "full",
          rows: 2,
        },
      };

      const result = getDefaultValuesFromMassiveConfig(configWithGridOptions);

      expect(result.grid_options).toEqual({
        columns: "full",
        rows: 2,
      });
    });

    it("should preserve grid_options and visibility as undefined when not present", () => {
      const configWithoutGridOptions: MediocreMassiveMediaPlayerCardConfig = {
        type: "custom:mediocre-massive-media-player-card",
        entity_id: "media_player.test",
        mode: "card",
      };

      const result = getDefaultValuesFromMassiveConfig(
        configWithoutGridOptions
      );

      expect(result.grid_options).toBeUndefined();
      expect(result.visibility).toBeUndefined();
    });

    it("should preserve visibility when present", () => {
      const configWithVisibility: MediocreMassiveMediaPlayerCardConfig = {
        type: "custom:mediocre-massive-media-player-card",
        entity_id: "media_player.test",
        mode: "card",
        visibility: [{ condition: "user", users: ["user1", "user2"] }],
      };

      const result = getDefaultValuesFromMassiveConfig(configWithVisibility);

      expect(result.visibility).toEqual([
        { condition: "user", users: ["user1", "user2"] },
      ]);
    });

    it("should set default values for all fields", () => {
      const minimalConfig: MediocreMassiveMediaPlayerCardConfig = {
        type: "custom:mediocre-massive-media-player-card",
        entity_id: "media_player.test",
        mode: "panel",
      };

      const result = getDefaultValuesFromMassiveConfig(minimalConfig);

      expect(result.type).toBe("custom:mediocre-massive-media-player-card");
      expect(result.entity_id).toBe("media_player.test");
      expect(result.use_art_colors).toBe(false);
      expect(result.mode).toBe("panel");
      expect(result.action).toEqual({});
      expect(result.speaker_group).toEqual({
        entity_id: null,
        entities: [],
      });
      expect(result.search).toEqual({
        enabled: false,
        show_favorites: false,
        entity_id: null,
        media_types: [],
      });
      expect(result.queue).toEqual({ enabled: false });
      expect(result.ma_entity_id).toBeNull();
      expect(result.custom_buttons).toEqual([]);
      expect(result.options).toEqual({
        always_show_power_button: false,
      });
      expect(result.grid_options).toBeUndefined();
    });
  });

  describe("getSimpleConfigFromFormValues", () => {
    it("should preserve grid_options even when empty", () => {
      const configWithEmptyGridOptions: MediocreMediaPlayerCardConfig = {
        type: "custom:mediocre-media-player-card",
        entity_id: "media_player.test",
        use_art_colors: false,
        tap_opens_popup: false,
        action: {},
        speaker_group: { entity_id: null, entities: [] },
        search: { enabled: false, show_favorites: false, entity_id: null },
        queue: { enabled: false },
        ma_entity_id: null,
        custom_buttons: [],
        options: {
          always_show_power_button: false,
          always_show_custom_buttons: false,
        },
        grid_options: {},
      };

      const result = getSimpleConfigFromFormValues(configWithEmptyGridOptions);

      expect(result).toHaveProperty("grid_options");
      expect(result.grid_options).toEqual({});
    });

    it("should preserve grid_options with values", () => {
      const configWithGridOptions: MediocreMediaPlayerCardConfig = {
        type: "custom:mediocre-media-player-card",
        entity_id: "media_player.test",
        use_art_colors: false,
        tap_opens_popup: false,
        action: {},
        speaker_group: { entity_id: null, entities: [] },
        search: { enabled: false, show_favorites: false, entity_id: null },
        queue: { enabled: false },
        ma_entity_id: null,
        custom_buttons: [],
        options: {
          always_show_power_button: false,
          always_show_custom_buttons: false,
        },
        grid_options: {
          columns: "full",
          rows: 2,
        },
      };

      const result = getSimpleConfigFromFormValues(configWithGridOptions);

      expect(result).toHaveProperty("grid_options");
      expect(result.grid_options).toEqual({
        columns: "full",
        rows: 2,
      });
    });

    it("should not include grid_options if undefined", () => {
      const configWithoutGridOptions: MediocreMediaPlayerCardConfig = {
        type: "custom:mediocre-media-player-card",
        entity_id: "media_player.test",
        use_art_colors: false,
        tap_opens_popup: false,
        action: {},
        speaker_group: { entity_id: null, entities: [] },
        search: { enabled: false, show_favorites: false, entity_id: null },
        queue: { enabled: false },
        ma_entity_id: null,
        custom_buttons: [],
        options: {
          always_show_power_button: false,
          always_show_custom_buttons: false,
        },
      };

      const result = getSimpleConfigFromFormValues(configWithoutGridOptions);

      expect(result).not.toHaveProperty("grid_options");
    });

    it("should remove falsy values but preserve grid_options", () => {
      const configWithFalsyValues: MediocreMediaPlayerCardConfig = {
        type: "custom:mediocre-media-player-card",
        entity_id: "media_player.test",
        use_art_colors: false,
        tap_opens_popup: false,
        action: {},
        speaker_group: { entity_id: null, entities: [] },
        search: { enabled: false, show_favorites: false, entity_id: null },
        queue: { enabled: false },
        ma_entity_id: null,
        custom_buttons: [],
        options: {
          always_show_power_button: false,
          always_show_custom_buttons: false,
        },
        grid_options: { columns: "full" },
      };

      const result = getSimpleConfigFromFormValues(configWithFalsyValues);

      // Should only have required fields and grid_options
      expect(result).toEqual({
        type: "custom:mediocre-media-player-card",
        entity_id: "media_player.test",
        grid_options: { columns: "full" },
      });
    });
  });

  describe("getSimpleConfigFromMassiveFormValues", () => {
    it("should preserve grid_options even when empty", () => {
      const configWithEmptyGridOptions: MediocreMassiveMediaPlayerCardConfig = {
        type: "custom:mediocre-massive-media-player-card",
        entity_id: "media_player.test",
        mode: "card",
        use_art_colors: false,
        action: {},
        speaker_group: { entity_id: null, entities: [] },
        search: { enabled: false, show_favorites: false, entity_id: null },
        queue: { enabled: false },
        ma_entity_id: null,
        custom_buttons: [],
        options: { always_show_power_button: false },
        grid_options: {},
      };

      const result = getSimpleConfigFromMassiveFormValues(
        configWithEmptyGridOptions
      );

      expect(result).toHaveProperty("grid_options");
      expect(result.grid_options).toEqual({});
    });

    it("should preserve grid_options with values", () => {
      const configWithGridOptions: MediocreMassiveMediaPlayerCardConfig = {
        type: "custom:mediocre-massive-media-player-card",
        entity_id: "media_player.test",
        mode: "card",
        use_art_colors: false,
        action: {},
        speaker_group: { entity_id: null, entities: [] },
        search: { enabled: false, show_favorites: false, entity_id: null },
        queue: { enabled: false },
        ma_entity_id: null,
        custom_buttons: [],
        options: { always_show_power_button: false },
        grid_options: {
          columns: "full",
          rows: 2,
        },
      };

      const result = getSimpleConfigFromMassiveFormValues(
        configWithGridOptions
      );

      expect(result).toHaveProperty("grid_options");
      expect(result.grid_options).toEqual({
        columns: "full",
        rows: 2,
      });
    });

    it("should remove falsy values but preserve grid_options", () => {
      const configWithFalsyValues: MediocreMassiveMediaPlayerCardConfig = {
        type: "custom:mediocre-massive-media-player-card",
        entity_id: "media_player.test",
        mode: "card",
        use_art_colors: false,
        action: {},
        speaker_group: { entity_id: null, entities: [] },
        search: { enabled: false, show_favorites: false, entity_id: null },
        queue: { enabled: false },
        ma_entity_id: null,
        custom_buttons: [],
        options: { always_show_power_button: false },
        grid_options: { columns: "full" },
      };

      const result = getSimpleConfigFromMassiveFormValues(
        configWithFalsyValues
      );

      // Should only have required fields and grid_options
      expect(result).toEqual({
        type: "custom:mediocre-massive-media-player-card",
        entity_id: "media_player.test",
        mode: "card",
        grid_options: { columns: "full" },
      });
    });
  });
});
