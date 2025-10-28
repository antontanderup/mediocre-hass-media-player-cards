import { getIsMassPlayer } from "@utils";
import type { MediaPlayerEntity } from "@types";

describe("getIsMassPlayer", () => {
  it("returns true if mass_player_type is present", () => {
    const entity: MediaPlayerEntity = {
      entity_id: "media_player.mass_player_1",
      state: "playing",
      attributes: {
        mass_player_type: "player",
        friendly_name: "Mass Player 1",
      },
      last_changed: "",
      last_updated: "",
      context: { id: "", user_id: null, parent_id: null },
      // domain: "media_player"
    };
    expect(getIsMassPlayer(entity)).toBe(true);
  });

  it("returns false if mass_player_type is not present", () => {
    const entity: MediaPlayerEntity = {
      entity_id: "media_player.other_player",
      state: "playing",
      attributes: {
        friendly_name: "Other Player",
      },
      last_changed: "",
      last_updated: "",
      context: { id: "", user_id: null, parent_id: null },
      // domain: "media_player"
    };
    expect(getIsMassPlayer(entity)).toBe(false);
  });
});
