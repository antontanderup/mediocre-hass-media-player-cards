import { getMediocreMassiveLegacyConfigToMediocreMultiConfig } from "./getMediocreMassiveLegacyConfigToMultiConfig";
import type { MediocreMassiveMediaPlayerCardConfig } from "@types";

// The function always returns a large multi config; cast to access union-specific fields
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LargeMultiConfig = any;

const baseConfig: MediocreMassiveMediaPlayerCardConfig = {
  type: "custom:mediocre-massive-media-player-card",
  entity_id: "media_player.main",
  mode: "card",
};

describe("getMediocreMassiveLegacyConfigToMediocreMultiConfig", () => {
  it("sets the correct output type", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(
      baseConfig
    );
    expect(result.type).toBe("custom:mediocre-multi-media-player-card");
  });

  it("includes the main entity as the first media_player with can_be_grouped: true", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(
      baseConfig
    );
    expect(result.media_players[0]).toMatchObject({
      entity_id: "media_player.main",
      can_be_grouped: true,
    });
  });

  it("sets size to large", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(
      baseConfig
    );
    expect(result.size).toBe("large");
  });

  it("converts popup mode to in-card", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig({
      ...baseConfig,
      mode: "popup",
    }) as LargeMultiConfig;
    expect(result.mode).toBe("in-card");
  });

  it("preserves non-popup modes", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig({
      ...baseConfig,
      mode: "panel",
    }) as LargeMultiConfig;
    expect(result.mode).toBe("panel");
  });

  it("sets transparent_background_on_home for panel mode", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig({
      ...baseConfig,
      mode: "panel",
    }) as LargeMultiConfig;
    expect(result.options?.transparent_background_on_home).toBe(true);
  });

  it("sets transparent_background_on_home for popup mode", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig({
      ...baseConfig,
      mode: "popup",
    }) as LargeMultiConfig;
    expect(result.options?.transparent_background_on_home).toBe(true);
  });

  it("does not set transparent_background_on_home for card mode", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig({
      ...baseConfig,
      mode: "card",
    }) as LargeMultiConfig;
    expect(result.options?.transparent_background_on_home).toBe(false);
  });

  it("expands speaker_group entities into separate media_players", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      ...baseConfig,
      speaker_group: {
        entity_id: "media_player.group",
        entities: ["media_player.speaker1", "media_player.speaker2"],
      },
    };
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(config);
    const entityIds = result.media_players.map(p => p.entity_id);
    expect(entityIds).toContain("media_player.speaker1");
    expect(entityIds).toContain("media_player.speaker2");
  });

  it("all expanded speaker_group entities have can_be_grouped: true", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      ...baseConfig,
      speaker_group: {
        entity_id: "media_player.group",
        entities: ["media_player.speaker1"],
      },
    };
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(config);
    result.media_players.forEach(p => {
      expect(p.can_be_grouped).toBe(true);
    });
  });

  it("skips main entity from speaker_group entities to avoid duplicates", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      ...baseConfig,
      speaker_group: {
        entity_id: "media_player.group",
        entities: ["media_player.main", "media_player.speaker1"],
      },
    };
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(config);
    const entityIds = result.media_players.map(p => p.entity_id);
    expect(entityIds.filter(id => id === "media_player.main")).toHaveLength(1);
    expect(entityIds).toContain("media_player.speaker1");
  });

  it("supports object-format entities with name in speaker_group", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      ...baseConfig,
      speaker_group: {
        entities: [{ entity: "media_player.named", name: "Named Speaker" }],
      },
    };
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(config);
    expect(result.media_players[1]).toMatchObject({
      entity_id: "media_player.named",
      name: "Named Speaker",
      can_be_grouped: true,
    });
  });

  it("sets disable_player_focus_switching to true", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(
      baseConfig
    );
    expect(result.disable_player_focus_switching).toBe(true);
  });

  it("sets hide_selected_player_header option to true", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(
      baseConfig
    ) as LargeMultiConfig;
    expect(result.options?.hide_selected_player_header).toBe(true);
  });

  it("passes through use_art_colors, defaulting to false", () => {
    const withColors = getMediocreMassiveLegacyConfigToMediocreMultiConfig({
      ...baseConfig,
      use_art_colors: true,
    });
    const withoutColors = getMediocreMassiveLegacyConfigToMediocreMultiConfig(
      baseConfig
    );
    expect(withColors.use_art_colors).toBe(true);
    expect(withoutColors.use_art_colors).toBe(false);
  });

  it("passes through ma_entity_id", () => {
    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig({
      ...baseConfig,
      ma_entity_id: "media_player.mass",
    });
    expect(result.media_players[0].ma_entity_id).toBe("media_player.mass");
  });
});
