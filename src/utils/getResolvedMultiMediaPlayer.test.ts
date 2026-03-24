import { MediocreMultiMediaPlayerCardConfig } from "@types";
import { getResolvedMultiMediaPlayer } from "./getResolvedMultiMediaPlayer";

describe("getResolvedMultiMediaPlayer", () => {
  it("falls back to root media_browser when the player does not define one", () => {
    const config = {
      media_browser: [
        {
          entity_id: "media_player.shared_browser",
          name: "Shared Browser",
          media_types: [{ media_type: "artists" }, { media_type: "albums" }],
        },
      ],
    } as Pick<MediocreMultiMediaPlayerCardConfig, "media_browser">;

    const player = {
      entity_id: "media_player.kitchen",
      name: "Kitchen",
    };

    expect(getResolvedMultiMediaPlayer(config, player)).toEqual({
      ...player,
      media_browser: config.media_browser,
    });
  });

  it("keeps the player's own media_browser when present", () => {
    const config = {
      media_browser: [
        {
          entity_id: "media_player.shared_browser",
          name: "Shared Browser",
        },
      ],
    } as Pick<MediocreMultiMediaPlayerCardConfig, "media_browser">;

    const player = {
      entity_id: "media_player.office",
      name: "Office",
      media_browser: [
        {
          entity_id: "media_player.office_browser",
          name: "Office Browser",
          media_types: [{ media_type: "tracks" }],
        },
      ],
    };

    expect(getResolvedMultiMediaPlayer(config, player)).toEqual(player);
  });
});
