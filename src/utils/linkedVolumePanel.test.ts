import type { MediaPlayerEntity, MediocreMultiMediaPlayer } from "@types";
import {
  getCanOpenLinkedVolumePanel,
  getCleanLinkedVolumePanel,
  getConfiguredLinkedVolumePanelEntities,
  getLinkedVolumePanelSections,
} from "./linkedVolumePanel";

const createPlayer = (
  overrides: Partial<MediocreMultiMediaPlayer> = {}
): MediocreMultiMediaPlayer => ({
  entity_id: "media_player.living_room",
  ...overrides,
});

const createState = (groupMembers?: string[]) =>
  ({
    entity_id: "media_player.test",
    state: "playing",
    attributes: {
      group_members: groupMembers,
    },
  }) as MediaPlayerEntity;

describe("linkedVolumePanel", () => {
  it("cleans and trims configured entities", () => {
    expect(
      getCleanLinkedVolumePanel({
        launch_from: "trailing_volume_bar_button",
        include_grouped_players: true,
        entities: [
          {
            entity_id: " media_player.living_room ",
            name: " Living Room ",
            icon: " mdi:speaker ",
            show_power: true,
          },
        ],
      })
    ).toEqual({
      launch_from: "trailing_volume_bar_button",
      include_grouped_players: true,
      entities: [
        {
          entity_id: "media_player.living_room",
          name: "Living Room",
          icon: "mdi:speaker",
          show_power: true,
        },
      ],
    });
  });

  it("returns undefined when panel config is effectively empty", () => {
    expect(
      getCleanLinkedVolumePanel({
        launch_from: "disabled",
        entities: [],
      })
    ).toBeUndefined();
  });

  it("only exposes unique configured entities", () => {
    const player = createPlayer({
      linked_volume_panel: {
        entities: [
          { entity_id: "media_player.one" },
          { entity_id: "media_player.one" },
          { entity_id: "media_player.two" },
        ],
      },
    });

    expect(getConfiguredLinkedVolumePanelEntities(player)).toEqual([
      { entity_id: "media_player.one" },
      { entity_id: "media_player.two" },
    ]);
  });

  it("does not open when launch_from is disabled", () => {
    const player = createPlayer({
      linked_volume_panel: {
        entities: [{ entity_id: "media_player.living_room" }],
      },
    });

    expect(getCanOpenLinkedVolumePanel(player, [player], {})).toBe(false);
  });

  it("opens when trailing button is enabled and configured entities exist", () => {
    const player = createPlayer({
      linked_volume_panel: {
        launch_from: "trailing_volume_bar_button",
        entities: [{ entity_id: "media_player.living_room" }],
      },
    });

    expect(getCanOpenLinkedVolumePanel(player, [player], {})).toBe(true);
  });

  it("groups linked volume entities by player sections", () => {
    const selectedPlayer = createPlayer({
      entity_id: "media_player.living_room",
      speaker_group_entity_id: "media_player.living_room_group",
      linked_volume_panel: {
        launch_from: "trailing_volume_bar_button",
        include_grouped_players: true,
        entities: [
          { entity_id: "media_player.living_room" },
          { entity_id: "media_player.receiver" },
        ],
      },
    });
    const kitchenPlayer = createPlayer({
      entity_id: "media_player.kitchen",
      speaker_group_entity_id: "media_player.kitchen_group",
      name: "Kitchen",
    });
    const officePlayer = createPlayer({
      entity_id: "media_player.office",
      speaker_group_entity_id: "media_player.office_group",
    });

    expect(
      getLinkedVolumePanelSections(
        selectedPlayer,
        [selectedPlayer, kitchenPlayer, officePlayer],
        {
          "media_player.living_room_group": createState([
            "media_player.living_room_group",
            "media_player.office_group",
            "media_player.kitchen_group",
          ]),
        }
      )
    ).toEqual([
      {
        key: "media_player.living_room",
        title: "media_player.living_room",
        entities: [
          { entity_id: "media_player.living_room" },
          { entity_id: "media_player.receiver" },
        ],
      },
      {
        key: "media_player.office",
        title: "media_player.office",
        entities: [{ entity_id: "media_player.office" }],
      },
      {
        key: "media_player.kitchen",
        title: "media_player.kitchen",
        entities: [{ entity_id: "media_player.kitchen" }],
      },
    ]);
  });

  it("does not duplicate grouped player self rows when explicitly configured", () => {
    const selectedPlayer = createPlayer({
      entity_id: "media_player.living_room",
      speaker_group_entity_id: "media_player.living_room_group",
      linked_volume_panel: {
        launch_from: "trailing_volume_bar_button",
        include_grouped_players: true,
        entities: [{ entity_id: "media_player.kitchen", show_power: true }],
      },
    });
    const kitchenPlayer = createPlayer({
      entity_id: "media_player.kitchen",
      speaker_group_entity_id: "media_player.kitchen_group",
      name: "Kitchen",
      linked_volume_panel: {
        entities: [{ entity_id: "media_player.kitchen", show_power: true }],
      },
    });

    expect(
      getLinkedVolumePanelSections(selectedPlayer, [selectedPlayer, kitchenPlayer], {
        "media_player.living_room_group": createState([
          "media_player.living_room_group",
          "media_player.kitchen_group",
        ]),
      })
    ).toEqual([
      {
        key: "media_player.living_room",
        title: "media_player.living_room",
        entities: [{ entity_id: "media_player.kitchen", show_power: true }],
      },
      {
        key: "media_player.kitchen",
        title: "media_player.kitchen",
        entities: [{ entity_id: "media_player.kitchen", show_power: true }],
      },
    ]);
  });
});
