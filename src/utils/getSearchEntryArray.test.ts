import { getSearchEntryArray } from "./getSearchEntryArray";
import { SearchLegacyEntry, SearchEntry } from "../types/config";

jest.mock("./getHass", () => ({
  getHass: jest.fn(),
}));
const { getHass } = require("./getHass");

describe("getSearchEntryArray", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("returns empty array for undefined config", () => {
    expect(getSearchEntryArray(undefined as any, "media_player.test")).toEqual(
      []
    );
  });

  it("returns array as-is for new format", () => {
    const entry: SearchEntry = {
      name: "Test Player",
      entity_id: "media_player.test",
      media_types: [{ media_type: "music" }],
    };
    expect(getSearchEntryArray([entry], "media_player.test")).toEqual([entry]);
  });

  it("returns empty array for legacy entry not enabled", () => {
    const legacy: SearchLegacyEntry = {
      enabled: false,
      entity_id: "media_player.legacy",
    };
    expect(getSearchEntryArray(legacy, "media_player.test")).toEqual([]);
  });

  it("converts enabled legacy entry to new format, uses entity_id fallback, no friendly_name", () => {
    getHass.mockReturnValue({
      states: { "media_player.test": { attributes: {} } },
    });
    const legacy: SearchLegacyEntry = {
      enabled: true,
      media_types: [{ media_type: "music" }],
    };
    expect(getSearchEntryArray(legacy, "media_player.test")).toEqual([
      {
        name: "Search",
        entity_id: "media_player.test",
        media_types: [{ media_type: "music" }],
      },
    ]);
  });

  it("converts enabled legacy entry to new format, uses entity_id fallback, with friendly_name", () => {
    getHass.mockReturnValue({
      states: {
        "media_player.test": { attributes: { friendly_name: "Search" } },
      },
    });
    const legacy: SearchLegacyEntry = {
      enabled: true,
      media_types: [{ media_type: "music" }],
    };
    expect(getSearchEntryArray(legacy, "media_player.test")).toEqual([
      {
        name: "Search",
        entity_id: "media_player.test",
        media_types: [{ media_type: "music" }],
      },
    ]);
  });

  it("converts enabled legacy entry to new format, uses legacy entity_id if present, no friendly_name", () => {
    getHass.mockReturnValue({
      states: { "media_player.legacy": { attributes: {} } },
    });
    const legacy: SearchLegacyEntry = {
      enabled: true,
      entity_id: "media_player.legacy",
      media_types: [{ media_type: "music" }],
    };
    expect(getSearchEntryArray(legacy, "media_player.test")).toEqual([
      {
        name: "Search",
        entity_id: "media_player.legacy",
        media_types: [{ media_type: "music" }],
      },
    ]);
  });

  it("converts enabled legacy entry to new format, uses legacy entity_id if present, with friendly_name", () => {
    getHass.mockReturnValue({
      states: {
        "media_player.legacy": {
          attributes: { friendly_name: "Legacy Player" },
        },
      },
    });
    const legacy: SearchLegacyEntry = {
      enabled: true,
      entity_id: "media_player.legacy",
      media_types: [{ media_type: "music" }],
    };
    expect(getSearchEntryArray(legacy, "media_player.test")).toEqual([
      {
        name: "Legacy Player",
        entity_id: "media_player.legacy",
        media_types: [{ media_type: "music" }],
      },
    ]);
  });
});
