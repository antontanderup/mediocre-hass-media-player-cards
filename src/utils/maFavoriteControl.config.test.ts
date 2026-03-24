import {
  getDefaultValuesFromMassiveConfig,
  getSimpleConfigFromMassiveFormValues,
} from "@utils/cardConfigUtils";
import { getMediocreLegacyConfigToMediocreMultiConfig } from "./getMediocreLegacyConfigToMultiConfig";
import { getMediocreMassiveLegacyConfigToMediocreMultiConfig } from "./getMediocreMassiveLegacyConfigToMultiConfig";
import { getMultiConfigToMediocreMassiveConfig } from "./getMultiConfigToMediocreMassiveConfig";
import type {
  MediocreMassiveMediaPlayerCardConfig,
  MediocreMediaPlayerCardConfig,
  MediocreMultiMediaPlayerCardConfig,
} from "@types";

describe("maFavoriteControl config plumbing", () => {
  it("preserves MA favorite control fields in massive config defaults and cleanup", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      type: "custom:mediocre-massive-media-player-card",
      entity_id: "media_player.test",
      mode: "card",
      ma_favorite_control: {
        show_on_artwork: true,
        active_icon: "mdi:heart",
        active_color: "#ffcc00",
      },
      options: {
        volume_trailing_button: "ma_favorite",
      },
    };

    expect(getDefaultValuesFromMassiveConfig(config)).toEqual(
      expect.objectContaining({
        ma_favorite_control: {
          show_on_artwork: true,
          active_icon: "mdi:heart",
          active_color: "#ffcc00",
        },
        options: expect.objectContaining({
          volume_trailing_button: "ma_favorite",
        }),
      })
    );

    expect(getSimpleConfigFromMassiveFormValues(config)).toEqual(
      expect.objectContaining({
        mode: "card",
        ma_favorite_control: {
          show_on_artwork: true,
          active_icon: "mdi:heart",
          active_color: "#ffcc00",
        },
        options: {
          volume_trailing_button: "ma_favorite",
        },
      })
    );
  });

  it("moves MA favorite control from legacy regular card config to the multi-card root", () => {
    const config: MediocreMediaPlayerCardConfig = {
      type: "custom:mediocre-media-player-card",
      entity_id: "media_player.living_room",
      ma_entity_id: "media_player.ma_living_room",
      ma_favorite_button_entity_id: "button.favorite_current_song",
      ma_favorite_control: {
        show_on_artwork: true,
        artwork_button_size: "medium",
      },
    };

    const result = getMediocreLegacyConfigToMediocreMultiConfig(config);

    expect(result.ma_favorite_control).toEqual({
      show_on_artwork: true,
      artwork_button_size: "medium",
    });
    expect(result.media_players[0].ma_favorite_button_entity_id).toBe(
      "button.favorite_current_song"
    );
  });

  it("moves MA favorite control from legacy massive card config to the multi-card root", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      type: "custom:mediocre-massive-media-player-card",
      entity_id: "media_player.living_room",
      mode: "card",
      ma_entity_id: "media_player.ma_living_room",
      ma_favorite_button_entity_id: "button.favorite_current_song",
      ma_favorite_control: {
        active_icon: "mdi:star",
        inactive_icon: "mdi:star-outline",
      },
    };

    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(config);

    expect(result.ma_favorite_control).toEqual({
      active_icon: "mdi:star",
      inactive_icon: "mdi:star-outline",
    });
    expect(result.media_players[0].ma_favorite_button_entity_id).toBe(
      "button.favorite_current_song"
    );
  });

  it("passes MA favorite control from multi-card config to the derived massive config", () => {
    const config: MediocreMultiMediaPlayerCardConfig = {
      type: "custom:mediocre-multi-media-player-card",
      entity_id: "media_player.living_room",
      size: "large",
      mode: "panel",
      ma_favorite_control: {
        show_on_artwork: true,
        active_color: "#f2c94c",
      },
      media_players: [
        {
          entity_id: "media_player.living_room",
          can_be_grouped: true,
          ma_entity_id: "media_player.ma_living_room",
          ma_favorite_button_entity_id: "button.favorite_current_song",
        },
      ],
      options: {
        volume_trailing_button: "ma_favorite",
      },
    };

    const result = getMultiConfigToMediocreMassiveConfig(
      config,
      config.media_players[0],
      "panel"
    );

    expect(result.ma_favorite_control).toEqual({
      show_on_artwork: true,
      active_color: "#f2c94c",
    });
    expect(result.ma_favorite_button_entity_id).toBe(
      "button.favorite_current_song"
    );
    expect(result.options).toEqual(
      expect.objectContaining({
        volume_trailing_button: "ma_favorite",
      })
    );
  });
});
