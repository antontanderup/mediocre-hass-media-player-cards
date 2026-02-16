import { getMultiConfigToMediocreMassiveConfig } from "./getMultiConfigToMediocreMassiveConfig";
import { MediocreMultiMediaPlayerCardConfig } from "@types";

describe("getMultiConfigToMediocreMassiveConfig", () => {
  const baseConfig: MediocreMultiMediaPlayerCardConfig = {
    type: "custom:mediocre-multi-media-player-card",
    entity_id: "media_player.living_room",
    media_players: [
      {
        entity_id: "media_player.living_room",
        name: "Living Room",
        speaker_group_entity_id: "media_player.living_room_group",
        can_be_grouped: true,
        ma_entity_id: "ma.living_room",
        lms_entity_id: "lms.living_room",
        action: { tap_action: { action: "toggle" } },
        search: [
          { entity_id: "media_player.living_room", name: "Search Living Room" },
        ],
        media_browser: [
          {
            entity_id: "media_player.living_room",
            name: "Living Room Browser",
          },
        ],
        custom_buttons: [
          {
            icon: "mdi:play",
            name: "Play",
            tap_action: {
              action: "perform-action",
              perform_action: "media_play",
              target: {},
            },
          },
        ],
      },
      {
        entity_id: "media_player.kitchen",
        name: "Kitchen",
        speaker_group_entity_id: "media_player.kitchen_group",
        can_be_grouped: true,
      },
      {
        entity_id: "media_player.bedroom",
        name: "Bedroom",
        can_be_grouped: false,
      },
    ],
    use_art_colors: true,
    options: {
      show_volume_step_buttons: true,
      use_volume_up_down_for_step_buttons: false,
    },
    size: "large",
    mode: "panel",
  };

  it("should map selected player and speaker group correctly", () => {
    const selectedPlayer = baseConfig.media_players[0];
    const result = getMultiConfigToMediocreMassiveConfig(
      baseConfig,
      selectedPlayer,
      "panel"
    );
    expect(result).toEqual(
      expect.objectContaining({
        type: "custom:mediocre-massive-media-player-card",
        entity_id: "media_player.living_room",
        name: "Living Room",
        use_art_colors: true,
        action: { tap_action: { action: "toggle" } },
        ma_entity_id: "ma.living_room",
        lms_entity_id: "lms.living_room",
        search: [
          { entity_id: "media_player.living_room", name: "Search Living Room" },
        ],
        media_browser: [
          {
            entity_id: "media_player.living_room",
            name: "Living Room Browser",
          },
        ],
        custom_buttons: [
          {
            icon: "mdi:play",
            name: "Play",
            tap_action: {
              action: "perform-action",
              perform_action: "media_play",
              target: {},
            },
          },
        ],
        mode: "panel",
        speaker_group: {
          entity_id: "media_player.living_room_group",
          entities: [
            { name: "Living Room", entity: "media_player.living_room_group" },
            { name: "Kitchen", entity: "media_player.kitchen_group" },
          ],
        },
        options: {
          show_volume_step_buttons: true,
          use_volume_up_down_for_step_buttons: false,
        },
      })
    );
  });

  it("should omit speaker_group if only one groupable player", () => {
    const config = {
      ...baseConfig,
      media_players: [
        {
          entity_id: "media_player.living_room",
          name: "Living Room",
          can_be_grouped: true,
        },
        {
          entity_id: "media_player.bedroom",
          name: "Bedroom",
          can_be_grouped: false,
        },
      ],
    };
    const selectedPlayer = config.media_players[0];
    const result = getMultiConfigToMediocreMassiveConfig(
      config,
      selectedPlayer,
      "card"
    );
    expect(result.speaker_group).toBeUndefined();
  });

  it("should use fallback entity if no speaker_group_entity_id", () => {
    const config = {
      ...baseConfig,
      media_players: [
        {
          entity_id: "media_player.living_room",
          name: "Living Room",
          can_be_grouped: true,
        },
        {
          entity_id: "media_player.kitchen",
          name: "Kitchen",
          can_be_grouped: true,
        },
      ],
    };
    const selectedPlayer = config.media_players[0];
    const result = getMultiConfigToMediocreMassiveConfig(
      config,
      selectedPlayer,
      "panel"
    );
    expect(result.speaker_group?.entities).toEqual([
      { name: "Living Room", entity: "media_player.living_room" },
      { name: "Kitchen", entity: "media_player.kitchen" },
    ]);
  });

  it("should set options defaults if not present", () => {
    const config = { ...baseConfig, options: undefined };
    const selectedPlayer = config.media_players[0];
    const result = getMultiConfigToMediocreMassiveConfig(
      config,
      selectedPlayer,
      "panel"
    );
    expect(result.options).toEqual({
      show_volume_step_buttons: false,
      use_volume_up_down_for_step_buttons: false,
    });
  });
});
