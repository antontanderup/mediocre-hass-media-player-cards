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

describe("grouped volume panel config plumbing", () => {
  it("preserves volume panel fields and group_volume mode in massive config defaults and cleanup", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      type: "custom:mediocre-massive-media-player-card",
      entity_id: "media_player.test",
      mode: "card",
      volume_panel: {
        show_when: "always",
        entities: [
          {
            entity_id: "media_player.zone_1",
            name: "Zone 1",
            show_power: true,
          },
        ],
      },
      options: {
        volume_trailing_button: "group_volume",
      },
    };

    expect(getDefaultValuesFromMassiveConfig(config)).toEqual(
      expect.objectContaining({
        volume_panel: {
          show_when: "always",
          entities: [
            {
              entity_id: "media_player.zone_1",
              name: "Zone 1",
              show_power: true,
            },
          ],
        },
        options: expect.objectContaining({
          volume_trailing_button: "group_volume",
        }),
      })
    );

    expect(getSimpleConfigFromMassiveFormValues(config)).toEqual(
      expect.objectContaining({
        mode: "card",
        volume_panel: {
          show_when: "always",
          entities: [
            {
              entity_id: "media_player.zone_1",
              name: "Zone 1",
              show_power: true,
            },
          ],
        },
        options: {
          volume_trailing_button: "group_volume",
        },
      })
    );
  });

  it("moves volume_panel from legacy regular card config to the main multi-player entry", () => {
    const config: MediocreMediaPlayerCardConfig = {
      type: "custom:mediocre-media-player-card",
      entity_id: "media_player.living_room",
      volume_panel: {
        entities: [
          {
            entity_id: "media_player.receiver",
            name: "Receiver",
            show_power: true,
            power_entity_id: "media_player.receiver",
          },
        ],
      },
    };

    const result = getMediocreLegacyConfigToMediocreMultiConfig(config);

    expect(result.media_players[0].volume_panel).toEqual({
      entities: [
        {
          entity_id: "media_player.receiver",
          name: "Receiver",
          show_power: true,
          power_entity_id: "media_player.receiver",
        },
      ],
    });
  });

  it("moves volume_panel from legacy massive card config to the main multi-player entry", () => {
    const config: MediocreMassiveMediaPlayerCardConfig = {
      type: "custom:mediocre-massive-media-player-card",
      entity_id: "media_player.living_room",
      mode: "card",
      volume_panel: {
        show_when: "always",
        groups: [
          {
            name: "Main",
            entities: [{ entity_id: "media_player.zone_1", name: "Zone 1" }],
          },
        ],
      },
    };

    const result = getMediocreMassiveLegacyConfigToMediocreMultiConfig(config);

    expect(result.media_players[0].volume_panel).toEqual({
      show_when: "always",
      groups: [
        {
          name: "Main",
          entities: [{ entity_id: "media_player.zone_1", name: "Zone 1" }],
        },
      ],
    });
  });

  it("passes volume_panel from multi-card config to the derived massive config", () => {
    const config: MediocreMultiMediaPlayerCardConfig = {
      type: "custom:mediocre-multi-media-player-card",
      entity_id: "media_player.living_room",
      size: "large",
      mode: "panel",
      media_players: [
        {
          entity_id: "media_player.living_room",
          can_be_grouped: true,
          volume_panel: {
            show_when: "always",
            entities: [
              {
                entity_id: "media_player.zone_1",
                name: "Zone 1",
              },
            ],
          },
        },
      ],
      options: {
        volume_trailing_button: "group_volume",
      },
    };

    const result = getMultiConfigToMediocreMassiveConfig(
      config,
      config.media_players[0],
      "panel"
    );

    expect(result.volume_panel).toEqual({
      show_when: "always",
      entities: [
        {
          entity_id: "media_player.zone_1",
          name: "Zone 1",
        },
      ],
    });
    expect(result.options).toEqual(
      expect.objectContaining({
        volume_trailing_button: "group_volume",
      })
    );
  });
});
