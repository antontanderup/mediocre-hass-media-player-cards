import { setVolume } from "./setVolume";

jest.mock("./getHass", () => ({
  getHass: jest.fn(),
}));
const { getHass } = require("./getHass");

describe("setVolume", () => {
  let callService: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    callService = jest.fn();
  });

  it("calls volume_set for the main entity", () => {
    getHass.mockReturnValue({
      callService,
      states: {
        "media_player.main": {
          attributes: { volume_level: 0.5, group_members: [] },
        },
      },
    });

    setVolume("media_player.main", 0.8);

    expect(callService).toHaveBeenCalledWith("media_player", "volume_set", {
      entity_id: "media_player.main",
      volume_level: 0.8,
    });
  });

  it("does nothing when the entity is not found in hass states", () => {
    getHass.mockReturnValue({
      callService,
      states: {},
    });

    setVolume("media_player.missing", 0.5);

    expect(callService).not.toHaveBeenCalled();
  });

  it("syncs volume to grouped speakers when syncGroup is true", () => {
    getHass.mockReturnValue({
      callService,
      states: {
        "media_player.main": {
          attributes: {
            volume_level: 0.5,
            group_members: ["media_player.main", "media_player.speaker2"],
          },
        },
        "media_player.speaker2": {
          attributes: { volume_level: 0.4 },
        },
      },
    });

    setVolume("media_player.main", 1.0, true);

    // main entity volume call
    expect(callService).toHaveBeenCalledWith("media_player", "volume_set", {
      entity_id: "media_player.main",
      volume_level: 1.0,
    });

    // speaker2 should get proportional volume: 0.4 * (1.0/0.5) = 0.8
    expect(callService).toHaveBeenCalledWith("media_player", "volume_set", {
      entity_id: "media_player.speaker2",
      volume_level: 0.8,
    });
  });

  it("does not sync to grouped speakers when syncGroup is false", () => {
    getHass.mockReturnValue({
      callService,
      states: {
        "media_player.main": {
          attributes: {
            volume_level: 0.5,
            group_members: ["media_player.main", "media_player.speaker2"],
          },
        },
        "media_player.speaker2": {
          attributes: { volume_level: 0.4 },
        },
      },
    });

    setVolume("media_player.main", 0.8, false);

    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith("media_player", "volume_set", {
      entity_id: "media_player.main",
      volume_level: 0.8,
    });
  });

  it("clamps synced speaker volume to max 1", () => {
    getHass.mockReturnValue({
      callService,
      states: {
        "media_player.main": {
          attributes: {
            volume_level: 0.5,
            group_members: ["media_player.main", "media_player.speaker2"],
          },
        },
        "media_player.speaker2": {
          attributes: { volume_level: 0.9 },
        },
      },
    });

    setVolume("media_player.main", 1.0, true);

    expect(callService).toHaveBeenCalledWith("media_player", "volume_set", {
      entity_id: "media_player.speaker2",
      volume_level: 1.0,
    });
  });

  it("clamps synced speaker volume to min 0", () => {
    getHass.mockReturnValue({
      callService,
      states: {
        "media_player.main": {
          attributes: {
            volume_level: 0.5,
            group_members: ["media_player.main", "media_player.speaker2"],
          },
        },
        "media_player.speaker2": {
          attributes: { volume_level: 0.1 },
        },
      },
    });

    setVolume("media_player.main", 0, true);

    expect(callService).toHaveBeenCalledWith("media_player", "volume_set", {
      entity_id: "media_player.speaker2",
      volume_level: 0,
    });
  });
});
