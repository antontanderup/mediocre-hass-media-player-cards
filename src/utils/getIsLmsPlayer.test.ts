import { getIsLmsPlayer } from "./getIsLmsPlayer";
import type { MediaPlayerEntity } from "@types";

describe("getIsLmsPlayer", () => {
  it("returns true if entity_id matches lmsEntityId", () => {
    const entity: Partial<MediaPlayerEntity> = {
      entity_id: "media_player.lms_1",
    };
    expect(getIsLmsPlayer(entity, "media_player.lms_1")).toBe(true);
  });

  it("returns false if entity_id does not match lmsEntityId and no active_child", () => {
    const entity: Partial<MediaPlayerEntity> = {
      entity_id: "media_player.other",
    };
    expect(getIsLmsPlayer(entity, "media_player.lms_1")).toBe(false);
  });

  it("returns true if active_child matches lmsEntityId", () => {
    const entity: Partial<MediaPlayerEntity> = {
      entity_id: "media_player.parent",
      attributes: { active_child: "media_player.lms_1" },
    };
    expect(getIsLmsPlayer(entity, "media_player.lms_1")).toBe(true);
  });

  it("returns false if active_child does not match lmsEntityId", () => {
    const entity: Partial<MediaPlayerEntity> = {
      entity_id: "media_player.parent",
      attributes: { active_child: "media_player.other" },
    };
    expect(getIsLmsPlayer(entity, "media_player.lms_1")).toBe(false);
  });

  it("returns false if attributes is missing", () => {
    const entity: Partial<MediaPlayerEntity> = {
      entity_id: "media_player.parent",
    };
    expect(getIsLmsPlayer(entity, "media_player.lms_1")).toBe(false);
  });
});
