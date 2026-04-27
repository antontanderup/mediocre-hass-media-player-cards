// Serializable mock HomeAssistant data for Playwright screenshot tests.
// No functions — those are added in the browser context by screenshots.spec.ts.

// Feature bitmask covering pause, seek, volume set/mute, prev/next track,
// play_media, volume step, select source, stop, play, shuffle, repeat, grouping.
export const SUPPORTED_FEATURES = 971263;

// A colorful gradient SVG used as album art placeholder.
const albumArtSvg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">',
  "<defs>",
  '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">',
  '<stop offset="0%" stop-color="#6366f1"/>',
  '<stop offset="50%" stop-color="#a855f7"/>',
  '<stop offset="100%" stop-color="#ec4899"/>',
  "</linearGradient>",
  "</defs>",
  '<rect width="200" height="200" fill="url(#g)"/>',
  '<text x="100" y="115" font-family="serif" font-size="70"',
  ' text-anchor="middle" fill="rgba(255,255,255,0.85)">&#9835;</text>',
  "</svg>",
].join("");

export const albumArtDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(albumArtSvg)}`;

type EntityState = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: { id: string; parent_id: null; user_id: null };
};

function makePlayer(
  entityId: string,
  friendlyName: string,
  state: string,
  overrides: Partial<EntityState["attributes"]> = {}
): EntityState {
  const isActive = state === "playing" || state === "paused";
  return {
    entity_id: entityId,
    state,
    attributes: {
      friendly_name: friendlyName,
      media_title: isActive ? "Bohemian Rhapsody" : undefined,
      media_artist: isActive ? "Queen" : undefined,
      media_album_name: isActive ? "A Night at the Opera" : undefined,
      media_duration: 354,
      media_position: 127,
      media_position_updated_at: new Date().toISOString(),
      volume_level: 0.65,
      is_volume_muted: false,
      shuffle: false,
      repeat: "off",
      supported_features: SUPPORTED_FEATURES,
      entity_picture: isActive ? albumArtDataUri : undefined,
      device_class: "speaker",
      source: "Spotify",
      source_list: ["Spotify", "Bluetooth", "TV"],
      group_members: [entityId],
      ...overrides,
    },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    context: { id: "mock-ctx", parent_id: null, user_id: null },
  };
}

export const mockStates = {
  "media_player.living_room": makePlayer(
    "media_player.living_room",
    "Living Room",
    "playing",
    {
      group_members: ["media_player.living_room", "media_player.kitchen"],
    }
  ),
  "media_player.kitchen": makePlayer(
    "media_player.kitchen",
    "Kitchen",
    "paused",
    {
      media_title: "Hotel California",
      media_artist: "Eagles",
      media_album_name: "Hotel California",
      group_members: ["media_player.living_room", "media_player.kitchen"],
    }
  ),
  "media_player.bedroom": makePlayer(
    "media_player.bedroom",
    "Bedroom",
    "idle",
    {
      entity_picture: undefined,
      media_title: undefined,
      media_artist: undefined,
      media_album_name: undefined,
    }
  ),
  "media_player.office": makePlayer(
    "media_player.office",
    "Office",
    "playing",
    {
      media_title: "Stairway to Heaven",
      media_artist: "Led Zeppelin",
      media_album_name: "Led Zeppelin IV",
    }
  ),
};

// Serializable portion of the HomeAssistant object passed to page.evaluate.
export const mockHass = {
  language: "en",
  locale: {
    language: "en",
    number_format: "language",
    time_format: "language",
    date_format: "language",
    first_weekday: "language",
    currency: "USD",
    country: "US",
  },
  entities: {
    "media_player.living_room": {
      entity_id: "media_player.living_room",
      platform: "cast",
    },
    "media_player.kitchen": {
      entity_id: "media_player.kitchen",
      platform: "cast",
    },
    "media_player.bedroom": {
      entity_id: "media_player.bedroom",
      platform: "cast",
    },
    "media_player.office": {
      entity_id: "media_player.office",
      platform: "cast",
    },
  },
  states: mockStates,
  themes: { default_theme: "default", themes: {}, darkMode: true },
  // selectedTheme.dark drives isDarkMode() without relying on CSS variables.
  selectedTheme: { theme: "default", dark: true },
  user: {
    id: "test-user",
    name: "Test User",
    is_admin: true,
    is_owner: true,
    credentials: [],
    mfa_modules: [],
  },
  config: {
    components: [],
    version: "2024.1.0",
    location_name: "Home",
  },
  auth: { data: { hassUrl: "http://localhost:8123" } },
  panels: {},
  services: {},
  resources: {},
  translationMetadata: { fragments: [] },
};
