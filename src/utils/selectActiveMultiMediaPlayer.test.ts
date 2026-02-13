import { selectActiveMultiMediaPlayer } from "./selectActiveMultiMediaPlayer";
import { HomeAssistant, MediocreMultiMediaPlayerCardConfig } from "@types";

describe("selectActiveMultiMediaPlayer", () => {
  const basePlayer = (
    entity_id: string,
    overrides: Record<string, unknown> = {}
  ) => ({
    entity_id,
    ...overrides,
  });

  const baseState = (
    state: string,
    group_members: string[] = [],
    entity_id = "media_player.test"
  ) => ({
    state,
    attributes: { group_members },
    entity_id,
  });

  function makeHass(states: Record<string, unknown>): HomeAssistant {
    return {
      states,
      hassUrl: () => "",
    } as unknown as HomeAssistant;
  }

  it("returns the config.entity_id player if it is playing and group leader", () => {
    const config: MediocreMultiMediaPlayerCardConfig = {
      type: "multi",
      size: "large",
      mode: "card",
      entity_id: "media_player.a",
      media_players: [basePlayer("media_player.a")],
    };
    const hass = makeHass({
      "media_player.a": baseState(
        "playing",
        ["media_player.a"],
        "media_player.a"
      ),
    });
    expect(selectActiveMultiMediaPlayer(hass, config)?.entity_id).toBe(
      "media_player.a"
    );
  });

  it("returns another player if it is playing and group leader", () => {
    const config: MediocreMultiMediaPlayerCardConfig = {
      type: "multi",
      size: "large",
      mode: "card",
      entity_id: "media_player.a",
      media_players: [
        basePlayer("media_player.a"),
        basePlayer("media_player.b"),
      ],
    };
    const hass = makeHass({
      "media_player.a": baseState("idle", ["media_player.a"], "media_player.a"),
      "media_player.b": baseState(
        "playing",
        ["media_player.b"],
        "media_player.b"
      ),
    });
    expect(selectActiveMultiMediaPlayer(hass, config)?.entity_id).toBe(
      "media_player.b"
    );
  });

  it("returns config.entity_id player if no player is playing or paused", () => {
    const config: MediocreMultiMediaPlayerCardConfig = {
      type: "multi",
      size: "large",
      mode: "card",
      entity_id: "media_player.a",
      media_players: [
        basePlayer("media_player.a"),
        basePlayer("media_player.b"),
      ],
    };
    const hass = makeHass({
      "media_player.a": baseState("idle", ["media_player.a"], "media_player.a"),
      "media_player.b": baseState("off", ["media_player.b"], "media_player.b"),
    });
    expect(selectActiveMultiMediaPlayer(hass, config)?.entity_id).toBe(
      "media_player.a"
    );
  });

  it("handles speaker_group_entity_id", () => {
    const config: MediocreMultiMediaPlayerCardConfig = {
      type: "multi",
      size: "large",
      mode: "card",
      entity_id: "media_player.a",
      media_players: [
        basePlayer("media_player.a", {
          speaker_group_entity_id: "media_player.group",
        }),
        basePlayer("media_player.b"),
      ],
    };
    const hass = makeHass({
      "media_player.a": baseState("idle", ["media_player.a"], "media_player.a"),
      "media_player.b": baseState("idle", ["media_player.b"], "media_player.b"),
      "media_player.group": baseState(
        "playing",
        ["media_player.group"],
        "media_player.group"
      ),
    });
    expect(selectActiveMultiMediaPlayer(hass, config)?.entity_id).toBe(
      "media_player.a"
    );
  });
});
