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

describe("maFavoriteArtwork config plumbing", () => {
  it("preserves MA favorite artwork fields in massive config defaults and cleanup", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      type: "custom:mediocre-massive-media-player-card",
      entity_id: "media_player.test",
      mode: "card",
      ma_favorite_control: {
        show_on_artwork: true,
        favorite_button_size: "medium",
        favorite_button_offset: "18px 24px",
        active_color: "#ffd54f",
        inactive_color: "#101010",
      },
    };

    expect(getDefaultValuesFromMassiveConfig(config)).toEqual(
      expect.objectContaining({
        ma_favorite_control: {
          show_on_artwork: true,
          favorite_button_size: "medium",
          favorite_button_offset: "18px 24px",
          active_color: "#ffd54f",
          inactive_color: "#101010",
        },
      })
    );

    expect(getSimpleConfigFromMassiveFormValues(config)).toEqual(
      expect.objectContaining({
        mode: "card",
        ma_favorite_control: {
          show_on_artwork: true,
          favorite_button_size: "medium",
          favorite_button_offset: "18px 24px",
          active_color: "#ffd54f",
          inactive_color: "#101010",
        },
      })
    );
  });

  it("moves MA favorite artwork config from legacy regular card config to the first multi player", () => {
    const config: MediocreMediaPlayerCardConfig = {
      type: "custom:mediocre-media-player-card",
      entity_id: "media_player.living_room",
      ma_entity_id: "media_player.ma_living_room",
      ma_favorite_button_entity_id: "button.favorite_current_song",
      ma_favorite_control: {
        show_on_artwork: true,
        favorite_button_size: "medium",
      },
    };

    const result = getMediocreLegacyConfigToMediocreMultiConfig(config);

    expect(result.media_players[0].ma_favorite_control).toEqual({
      show_on_artwork: true,
      favorite_button_size: "medium",
    });
    expect(result.media_players[0].ma_favorite_button_entity_id).toBe(
      "button.favorite_current_song"
    );
  });

  it("moves MA favorite artwork config from legacy massive card config to the first multi player", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      type: "custom:mediocre-massive-media-player-card",
      entity_id: "media_player.living_room",
      mode: "card",
      ma_entity_id: "media_player.ma_living_room",
      ma_favorite_button_entity_id: "button.favorite_current_song",
      ma_favorite_control: {
        show_on_artwork: true,
        favorite_button_offset: "22px 18px",
      },
    };

    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(config);

    expect(result.media_players[0].ma_favorite_control).toEqual({
      show_on_artwork: true,
      favorite_button_offset: "22px 18px",
    });
    expect(result.media_players[0].ma_favorite_button_entity_id).toBe(
      "button.favorite_current_song"
    );
  });

  it("passes MA favorite artwork config from multi-card config to the derived massive config", () => {
    const config: MediocreMultiMediaPlayerCardConfig = {
      type: "custom:mediocre-multi-media-player-card",
      entity_id: "media_player.living_room",
      size: "large",
      mode: "panel",
      media_players: [
        {
          entity_id: "media_player.living_room",
          can_be_grouped: true,
          ma_entity_id: "media_player.ma_living_room",
          ma_favorite_button_entity_id: "button.favorite_current_song",
          ma_favorite_control: {
            show_on_artwork: true,
            favorite_button_offset: "20px 12px",
          },
        },
      ],
    };

    const result = getMultiConfigToMediocreMassiveConfig(
      config,
      config.media_players[0],
      "panel"
    );

    expect(result.ma_favorite_control).toEqual({
      show_on_artwork: true,
      favorite_button_offset: "20px 12px",
    });
    expect(result.ma_favorite_button_entity_id).toBe(
      "button.favorite_current_song"
    );
  });
});
