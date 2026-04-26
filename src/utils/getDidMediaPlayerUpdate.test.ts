import { getDidMediaPlayerUpdate } from "./getDidMediaPlayerUpdate";
import type { MediaPlayerEntity } from "@types";

const makeEntity = (
  overrides: Partial<MediaPlayerEntity> = {}
): MediaPlayerEntity =>
  ({
    entity_id: "media_player.test",
    state: "playing",
    attributes: {
      media_title: "Song",
      media_artist: "Artist",
      media_album_name: "Album",
      media_duration: 180,
      volume_level: 0.5,
      is_volume_muted: false,
      shuffle: false,
      repeat: "off",
      supported_features: 0,
      group_members: ["media_player.test"],
      icon: "mdi:speaker",
      friendly_name: "Test Player",
      entity_picture: "/img.jpg",
      entity_picture_local: "/local.jpg",
      source: "Spotify",
      active_child: undefined,
    },
    last_changed: "",
    last_updated: "",
    context: { id: "", user_id: null, parent_id: null },
    ...overrides,
  }) as unknown as MediaPlayerEntity;

describe("getDidMediaPlayerUpdate", () => {
  describe("full player (not group member)", () => {
    it("returns false when entities are identical", () => {
      const entity = makeEntity();
      expect(getDidMediaPlayerUpdate(entity, entity)).toBe(false);
    });

    it("detects state change", () => {
      const prev = makeEntity({ state: "playing" });
      const next = makeEntity({ state: "paused" });
      expect(getDidMediaPlayerUpdate(prev, next)).toBe(true);
    });

    it("detects media_title change", () => {
      const prev = makeEntity();
      const next = makeEntity({
        attributes: { ...prev.attributes, media_title: "New Song" },
      });
      expect(getDidMediaPlayerUpdate(prev, next)).toBe(true);
    });

    it("detects volume_level change", () => {
      const prev = makeEntity();
      const next = makeEntity({
        attributes: { ...prev.attributes, volume_level: 0.8 },
      });
      expect(getDidMediaPlayerUpdate(prev, next)).toBe(true);
    });

    it("detects shuffle change", () => {
      const prev = makeEntity();
      const next = makeEntity({
        attributes: { ...prev.attributes, shuffle: true },
      });
      expect(getDidMediaPlayerUpdate(prev, next)).toBe(true);
    });

    it("detects group_members array change", () => {
      const prev = makeEntity();
      const next = makeEntity({
        attributes: {
          ...prev.attributes,
          group_members: ["media_player.test", "media_player.other"],
        },
      });
      expect(getDidMediaPlayerUpdate(prev, next)).toBe(true);
    });

    it("returns false when group_members arrays have same contents", () => {
      const prev = makeEntity({
        attributes: {
          ...makeEntity().attributes,
          group_members: ["media_player.test", "media_player.other"],
        },
      });
      const next = makeEntity({
        attributes: {
          ...makeEntity().attributes,
          group_members: ["media_player.test", "media_player.other"],
        },
      });
      expect(getDidMediaPlayerUpdate(prev, next)).toBe(false);
    });
  });

  describe("group member (isGroupMember = true)", () => {
    it("returns false when group member state is unchanged", () => {
      const entity = makeEntity();
      expect(getDidMediaPlayerUpdate(entity, entity, true)).toBe(false);
    });

    it("detects state change for group member", () => {
      const prev = makeEntity({ state: "playing" });
      const next = makeEntity({ state: "idle" });
      expect(getDidMediaPlayerUpdate(prev, next, true)).toBe(true);
    });

    it("detects volume change for group member", () => {
      const prev = makeEntity();
      const next = makeEntity({
        attributes: { ...prev.attributes, volume_level: 0.9 },
      });
      expect(getDidMediaPlayerUpdate(prev, next, true)).toBe(true);
    });

    it("does not check media_title for group member", () => {
      const prev = makeEntity();
      const next = makeEntity({
        attributes: { ...prev.attributes, media_title: "Different Song" },
      });
      // media_title is not in group member compare keys
      expect(getDidMediaPlayerUpdate(prev, next, true)).toBe(false);
    });
  });
});
