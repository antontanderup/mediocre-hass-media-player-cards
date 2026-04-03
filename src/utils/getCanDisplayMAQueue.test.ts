import { getCanDisplayMAQueue } from "./getCanDisplayMAQueue";
import * as getHassModule from "./getHass";
import { HomeAssistant } from "@types";

describe("getCanDisplayMAQueue", () => {
  const mockGetHass = jest.spyOn(getHassModule, "getHass");

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

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns false when mass_queue service is not available", () => {
    mockGetHass.mockReturnValue({ ...baseHass, services: {} });
    expect(getCanDisplayMAQueue()).toBe(false);
  });

  it("returns true when mass_queue service is available", () => {
    mockGetHass.mockReturnValue({
      ...baseHass,
      services: { mass_queue: { get_queue_items: {} } as any },
    });
    expect(getCanDisplayMAQueue()).toBe(true);
  });

  it("returns false when only unrelated services are available", () => {
    mockGetHass.mockReturnValue({
      ...baseHass,
      services: { media_player: {} as any, music_assistant: {} as any },
    });
    expect(getCanDisplayMAQueue()).toBe(false);
  });
});
