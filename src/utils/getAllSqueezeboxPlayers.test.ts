import { getAllSqueezeboxPlayers } from "./getAllSqueezeboxPlayers";

jest.mock("@utils", () => ({
  getHass: jest.fn(),
}));
const { getHass } = require("@utils");

describe("getAllSqueezeboxPlayers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns squeezebox media_player entities", () => {
    const squeezeState = { entity_id: "media_player.squeezebox" };
    getHass.mockReturnValue({
      entities: {
        "media_player.squeezebox": { platform: "squeezebox" },
        "media_player.other": { platform: "sonos" },
        "light.lamp": { platform: "squeezebox" },
      },
      states: {
        "media_player.squeezebox": squeezeState,
      },
    });

    const result = getAllSqueezeboxPlayers();
    expect(result).toEqual([squeezeState]);
  });

  it("returns empty array when no squeezebox players exist", () => {
    getHass.mockReturnValue({
      entities: {
        "media_player.sonos": { platform: "sonos" },
      },
      states: {},
    });

    expect(getAllSqueezeboxPlayers()).toEqual([]);
  });
});
