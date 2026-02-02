  it("returns filters if present, regardless of media_types", () => {
    const entry: SearchEntry = {
      entity_id: "media_player.living_room",
      media_types: [
        { media_type: "music" },
      ],
      filters: [
        { media_content_type: "audiobook", icon: "mdi:book", name: "Audiobooks" },
      ],
    };
    expect(getSearchFilters(entry)).toEqual([
      { media_content_type: "audiobook", icon: "mdi:book", name: "Audiobooks" },
    ]);
  });
import { getSearchFilters } from "./getSearchFilters";
import { SearchEntry } from "../types/config";

describe("getSearchFilters", () => {
  it("returns undefined if no media_types", () => {
    const entry: SearchEntry = {
      entity_id: "media_player.living_room",
    };
    expect(getSearchFilters(entry)).toBeUndefined();
  });

  it("converts media_types to filters", () => {
    const entry: SearchEntry = {
      entity_id: "media_player.living_room",
      media_types: [
        { media_type: "music" },
        { media_type: "podcast", icon: "mdi:podcast", name: "Podcasts" },
      ],
    };
    expect(getSearchFilters(entry)).toEqual([
      { media_content_type: "music" },
      { media_content_type: "podcast", icon: "mdi:podcast", name: "Podcasts" },
    ]);
  });

  it("returns undefined for empty media_types array", () => {
    const entry: SearchEntry = {
      entity_id: "media_player.living_room",
      media_types: [],
    };
    expect(getSearchFilters(entry)).toBeUndefined();
  });
});
