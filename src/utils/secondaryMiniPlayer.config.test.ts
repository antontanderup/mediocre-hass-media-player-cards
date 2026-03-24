import {
  MediocreMassiveMediaPlayerCardConfig,
  MediocreMediaPlayerCardConfig,
} from "@types";
import { getMediocreLegacyConfigToMediocreMultiConfig } from "./getMediocreLegacyConfigToMultiConfig";
import { getMediocreMassiveLegacyConfigToMediocreMultiConfig } from "./getMediocreMassiveLegacyConfigToMultiConfig";

describe("secondary mini player config", () => {
  it("preserves hide_mini_player_on_secondary_views when converting legacy compact config", () => {
    const config: MediocreMediaPlayerCardConfig = {
      type: "custom:mediocre-media-player-card",
      entity_id: "media_player.test",
      tap_opens_popup: true,
      options: {
        hide_mini_player_on_secondary_views: true,
      },
    };

    const result = getMediocreLegacyConfigToMediocreMultiConfig(config);

    expect(result.options?.hide_mini_player_on_secondary_views).toBe(true);
  });

  it("preserves hide_mini_player_on_secondary_views when converting legacy massive config", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      type: "custom:mediocre-massive-media-player-card",
      entity_id: "media_player.test",
      mode: "panel",
      options: {
        hide_mini_player_on_secondary_views: true,
      },
    };

    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(config);

    expect(result.options?.hide_mini_player_on_secondary_views).toBe(true);
  });
});
