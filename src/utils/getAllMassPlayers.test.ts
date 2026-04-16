import { getAllMassPlayers } from "./getAllMassPlayers";

jest.mock("./getHass", () => ({
  getHass: jest.fn(),
}));
const { getHass } = require("./getHass");

const makeMassEntity = (entity_id: string) => ({
  entity_id,
  state: "playing",
  attributes: { mass_player_type: "player" },
});

const makeOtherEntity = (entity_id: string) => ({
  entity_id,
  state: "idle",
  attributes: {},
});

describe("getAllMassPlayers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns an empty array when hass is unavailable", () => {
    getHass.mockReturnValue(null);
    expect(getAllMassPlayers()).toEqual([]);
  });

  it("returns only Mass media_player entities", () => {
    const massPlayer = makeMassEntity("media_player.mass_player");
    const otherPlayer = makeOtherEntity("media_player.other");
    const light = makeOtherEntity("light.living_room");

    getHass.mockReturnValue({
      states: {
        "media_player.mass_player": massPlayer,
        "media_player.other": otherPlayer,
        "light.living_room": light,
      },
    });

    const result = getAllMassPlayers();
    expect(result).toHaveLength(1);
    expect(result[0].entity_id).toBe("media_player.mass_player");
  });

  it("returns empty array when no Mass players are present", () => {
    getHass.mockReturnValue({
      states: {
        "media_player.sonos": makeOtherEntity("media_player.sonos"),
      },
    });
    expect(getAllMassPlayers()).toEqual([]);
  });
});
