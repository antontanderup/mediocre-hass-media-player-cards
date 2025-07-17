import { getMediaPlayerTitleAndSubtitle } from "@utils/getMediaPlayerTitleAndSubtitle";
import { MediaPlayerEntity } from "@types";

describe("getMediaPlayerTitleAndSubtitle", () => {
  const base: MediaPlayerEntity = {
    entity_id: "media_player.living_room",
    state: "playing",
    attributes: {},
    last_changed: "",
    last_updated: "",
    context: {
      id: "context-id",
      user_id: "user-id",
      parent_id: "parent-id",
    },
  };

  it("returns unavailable for missing player", () => {
    // @ts-expect-error intentionally passing undefined
    expect(getMediaPlayerTitleAndSubtitle(undefined)).toEqual({
      title: "Unavailable",
      subtitle: "unknown unavailable",
    });
  });

  it("returns unavailable for unavailable state", () => {
    expect(
      getMediaPlayerTitleAndSubtitle({ ...base, state: "unavailable" })
    ).toEqual({
      title: "Unavailable",
      subtitle: "media_player.living_room unavailable",
    });
  });

  it("returns friendlyName for off state", () => {
    expect(
      getMediaPlayerTitleAndSubtitle({
        ...base,
        state: "off",
        attributes: { friendly_name: "My Player" },
      })
    ).toEqual({
      title: "My Player",
      subtitle: undefined,
    });
  });

  it("returns media title if present", () => {
    expect(
      getMediaPlayerTitleAndSubtitle({
        ...base,
        attributes: { media_title: "Song Title" },
      })
    ).toEqual({
      title: "Song Title",
      subtitle: undefined,
    });
  });

  it("returns source if no media title and valid source", () => {
    expect(
      getMediaPlayerTitleAndSubtitle({
        ...base,
        attributes: { source: "Spotify" },
      })
    ).toEqual({
      title: "Spotify",
      subtitle: undefined,
    });
  });

  it("returns friendlyName if no media title or source", () => {
    expect(
      getMediaPlayerTitleAndSubtitle({
        ...base,
        attributes: { friendly_name: "My Player" },
      })
    ).toEqual({
      title: "My Player",
      subtitle: undefined,
    });
  });

  it("returns album and artist in subtitle", () => {
    expect(
      getMediaPlayerTitleAndSubtitle({
        ...base,
        attributes: {
          media_title: "Song Title",
          media_album_name: "Album",
          media_artist: "Artist",
        },
      })
    ).toEqual({
      title: "Song Title",
      subtitle: "Album - Artist",
    });
  });

  it("returns only artist in subtitle if no album", () => {
    expect(
      getMediaPlayerTitleAndSubtitle({
        ...base,
        attributes: {
          media_title: "Song Title",
          media_artist: "Artist",
        },
      })
    ).toEqual({
      title: "Song Title",
      subtitle: "Artist",
    });
  });

  it("returns only album in subtitle if no artist", () => {
    expect(
      getMediaPlayerTitleAndSubtitle({
        ...base,
        attributes: {
          media_title: "Song Title",
          media_album_name: "Album",
        },
      })
    ).toEqual({
      title: "Song Title",
      subtitle: "Album - ",
    });
  });

  it("returns series title if present", () => {
    expect(
      getMediaPlayerTitleAndSubtitle({
        ...base,
        attributes: {
          media_title: "Episode Title",
          media_series_title: "Series Title",
          media_season: "3",
          media_episode: "5",
        },
      })
    ).toEqual({
      title: "Episode Title",
      subtitle: "Series Title - S3E5",
    });
  });
});
