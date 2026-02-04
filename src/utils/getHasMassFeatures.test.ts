import { getHasMassFeatures } from "./getHasMassFeatures";
import * as getHassModule from "./getHass";
import * as getIsMassPlayerModule from "./getIsMassPlayer";
import { MediaPlayerEntity, HomeAssistant } from "@types";

describe("getHasMassFeatures", () => {
  // Minimal mock for HomeAssistant to satisfy type requirements
  const baseHass = {
    hassUrl: () => "",
    entities: {},
    states: {},
    auth: undefined as any,
    connection: undefined as any,
    connected: true,
    services: {},
    callService: jest.fn(),
    callWS: jest.fn(),
    config: {} as any,
    themes: {} as any,
    panels: {} as any,
    language: "en",
    selectedTheme: null,
    dockedSidebar: false,
    moreInfoEntityId: "",
    user: {} as any,
    panelUrl: "",
    // Required properties to satisfy HomeAssistant type
    locale: {
      language: "en",
      number_format: 0 as any,
      time_format: "24" as any,
    },
    selectedLanguage: "en",
    resources: {},
    localize: jest.fn(),
    translationMetadata: {} as any,
    vibrate: false,
    suspendWhenHidden: false,
    enableShortcuts: false,
    callApi: jest.fn(),
    fetchWithAuth: jest.fn(),
    sendWS: jest.fn(),
  } as HomeAssistant;

  const mockGetHass = jest.spyOn(getHassModule, "getHass");
  const mockGetIsMassPlayer = jest.spyOn(
    getIsMassPlayerModule,
    "getIsMassPlayer"
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns true if entity_id and ma_entity_id are identical", () => {
    expect(getHasMassFeatures("media_player.foo", "media_player.foo")).toBe(
      true
    );
  });

  it("returns false if entity does not exist", () => {
    mockGetHass.mockReturnValue({ ...baseHass, states: {} });
    expect(getHasMassFeatures("media_player.unknown", "media_player.bar")).toBe(
      false
    );
  });

  it("returns true if entity is a MA player", () => {
    const entity = {
      entity_id: "media_player.foo",
      attributes: { mass_player_type: "something" },
    } as MediaPlayerEntity;
    mockGetHass.mockReturnValue({
      ...baseHass,
      states: { "media_player.foo": entity },
    });
    mockGetIsMassPlayer.mockReturnValue(true);
    expect(getHasMassFeatures("media_player.foo", "media_player.bar")).toBe(
      true
    );
  });

  it("returns false if entity has active_child and is not a MA player", () => {
    const entity = {
      entity_id: "media_player.foo",
      attributes: { active_child: "media_player.child" },
    } as MediaPlayerEntity;
    mockGetHass.mockReturnValue({
      ...baseHass,
      states: { "media_player.foo": entity },
    });
    mockGetIsMassPlayer.mockReturnValue(false);
    expect(getHasMassFeatures("media_player.foo", "media_player.bar")).toBe(
      false
    );
  });

  it("returns true if ma_entity_id is set and entity has no active_child", () => {
    const entity = {
      entity_id: "media_player.foo",
      attributes: {},
    } as MediaPlayerEntity;
    mockGetHass.mockReturnValue({
      ...baseHass,
      states: { "media_player.foo": entity },
    });
    mockGetIsMassPlayer.mockReturnValue(false);
    expect(getHasMassFeatures("media_player.foo", "media_player.bar")).toBe(
      true
    );
  });

  it("returns false if ma_entity_id is not set and entity has no active_child and is not a MA player", () => {
    const entity = {
      entity_id: "media_player.foo",
      attributes: {},
    } as MediaPlayerEntity;
    mockGetHass.mockReturnValue({
      ...baseHass,
      states: { "media_player.foo": entity },
    });
    mockGetIsMassPlayer.mockReturnValue(false);
    expect(getHasMassFeatures("media_player.foo")).toBe(false);
  });
});
