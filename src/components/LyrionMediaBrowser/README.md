# LyrionMediaBrowser

A media browser component for Logitech Media Server (LMS) / Lyrion Music Server, communicating via the `lyrion_cli` Home Assistant integration.

## Files

| File                           | Purpose                                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `LyrionMediaBrowser.tsx`       | Root component — renders navigation bar, breadcrumbs, search input, and virtual list                 |
| `useLyrionMediaBrowserData.ts` | Central state hook — navigation history, item enrichment, row grouping, playback actions             |
| `useLyrionBrowse.ts`           | Fetches a single LMS browse/query result and transforms it to `LyrionBrowserItem[]`                  |
| `useLyrionGlobalSearch.ts`     | Fires four parallel `useLyrionBrowse` calls (artists/albums/tracks/playlists) for home-screen search |
| `types.ts`                     | Shared types: `LyrionBrowserItem`, `LyrionNavigationItem`, `LyrionCategoryType`                      |
| `constants.ts`                 | Category definitions (`CATEGORIES`), command overrides (`CATEGORY_COMMANDS`), `HOME_ENTRY` sentinel  |
| `utils.ts`                     | Pure helpers: `BrowseContext` type, `buildBrowseParams`, `buildPlaylistSearchTerm`                   |

---

## Architecture Overview

```
LyrionMediaBrowser
  └── useLyrionMediaBrowserData          ← all state lives here
        ├── useLyrionGlobalSearch        ← home-screen search (parallel queries)
        │     └── useLyrionBrowse × 4
        ├── useLyrionBrowse              ← home preview: new music
        ├── useLyrionBrowse              ← home preview: favorites
        └── useLyrionBrowse              ← normal browsing (single query)
              └── useHassMessagePromise  ← lyrion_cli service call
```

---

## Navigation Model

Navigation is driven by a single `history` state array of `BrowserHistoryEntry` objects. Each entry records:

- `id` — LMS item ID (or category name like `"artists"`)
- `title` — display name for breadcrumbs
- `command` — the LMS CLI command to run at this level (e.g. `"albums"`, `"titles"`)
- `parameters` — extra parameters for the command (e.g. `["role_id:ALBUMARTIST"]`)
- `type` — item type (`"category"`, `"artist"`, `"album"`, `"track"`, `"genre"`, `"playlist"`, `"app"`)
- `filter` — the search/filter string active at this level

`history[0]` is always the synthetic `HOME_ENTRY` sentinel. The breadcrumb-visible portion is `history.slice(1)` (called `navHistory`).

### Navigation actions

| Action                   | Behaviour                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Click category           | Replace everything after `history[0]` with a new category entry                                              |
| Click expandable item    | Append a new entry; derive next command from item type (genre→artists, artist→albums, album/playlist→titles) |
| Click app                | Append entry; app's `id` is also its CLI command                                                             |
| Back                     | Pop last entry                                                                                               |
| Breadcrumb click (index) | Slice history to that index                                                                                  |
| Home                     | Reset to `[HOME_ENTRY]`, clear input                                                                         |

---

## Browse Modes

### 1. Home screen (categories + preview sections)

When `navHistory.length === 0` and no filter is typed, the component renders:

1. **Categories** — the static `CATEGORIES` list as a grid of folder items.
2. **New Music** — up to `chunkSize × 2` recent albums fetched via `albums 0 100 sort:new tags:alj`, displayed as a grid with a clickable section title.
3. **Favorites** — up to `chunkSize × 2` favorites fetched via `favorites items 0 100 want_url:1`, displayed as a grid with a clickable section title.
4. **Apps** - up to `chunkSize x 2` apps via `apps 0 100`, displayed as a grid with a clickable section title.

The section titles behave like the global-search section titles: clicking one navigates into that category (equivalent to clicking its tile in the categories grid). The two preview queries are driven by stable `HOME_NEW_MUSIC_PARAMS` / `HOME_FAVORITES_PARAMS` constants (defined in `constants.ts`) and enabled only while `isShowingHomePreview` (`isHomeScreen && !committedFilter`) is true.

### 2. Category / nested browsing

Once the user enters a category, `useLyrionBrowse` fires a `lyrion_cli` query. Before calling `buildBrowseParams`, the hook extracts a `BrowseContext` from `navHistory` — walking the stack once to identify ancestor IDs (genre, artist, album, playlist) and whether the user is inside an app. `buildBrowseParams` is a pure function that receives this context and constructs the correct LMS command and parameters:

- **Root category**: uses the category's command directly, applying tag sets (e.g. `tags:alj` for albums, `tags:altj` for tracks).
- **Nested (artist → albums → tracks)**: uses the pre-extracted ancestor IDs from `BrowseContext` to inject the appropriate `_id:` filter parameters.
- **Playlists**: uses the special `playlists tracks` command with the playlist ID as the first positional argument.
- **Apps / Radio**: uses `<app_cmd> items` with `item_id:` for sub-navigation.
- **Favorites**: uses `favorites items 0 100 want_url:1`.

Results are paginated in batches of 100. Loading more appends items to `accumulatedItems`; navigating or changing the filter resets pagination.

### 3. Global search (home screen with filter)

When the user types on the home screen, `useLyrionGlobalSearch` fires four concurrent `useLyrionBrowse` calls:

| Query     | Command     | Tags        |
| --------- | ----------- | ----------- |
| Artists   | `artists`   | `tags:a`    |
| Albums    | `albums`    | `tags:alj`  |
| Tracks    | `titles`    | `tags:altj` |
| Playlists | `playlists` | _(none)_    |

Results are merged, grouped into section rows (Artists / Albums / Tracks / Playlists), and capped at `chunkSize × 2` per section. Clicking a section header navigates into that category while preserving the filter text.

### 4. In-category search

For most non-app categories, the filter input appends `search:<term>` to the LMS query. The query re-runs with `startIndex=0` each time the debounced value changes (350 ms debounce).

Filter state uses three layers, all of which are necessary:

| State                  | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `inputValue`           | Immediate — drives the visible input field                              |
| `debouncedInputValue`  | Debounced (350 ms) — synced into `history[last].filter` via `useEffect` |
| `history[last].filter` | Committed — tied to the current navigation level, restored on back      |

When the user navigates, `inputValue` is reset to `history[last].filter` of the new level. Because `useDebounce` clears its pending timer whenever `inputValue` changes, any in-flight filter value from the previous level is cancelled before it can commit to the new level.

Search is disabled for:

- Favorites (LMS doesn't support search there)
- Apps that haven't yet returned a `search` node in their `loop_loop` — `appSearchItemId` (state in `useLyrionMediaBrowserData`) is `undefined` until the first browse result arrives, at which point the search input appears and `appSearchItemId` is available for subsequent queries

---

## LMS Communication

All queries go through `useHassMessagePromise` which calls the `lyrion_cli.query` Home Assistant service and returns the response. Server metadata (IP, HTTP port) is fetched once via `lyrion_cli.query serverstatus` with a 10-minute stale time.

The browse data has a 1-minute stale time.

---

## Item Transformation (`useLyrionBrowse`)

The raw LMS response is normalised into `LyrionBrowserItem[]` by inspecting which loop key is present in the response:

| Response key                                          | Item type                                |
| ----------------------------------------------------- | ---------------------------------------- |
| `artists_loop` / `contributors_loop`                  | `"artist"`                               |
| `albums_loop`                                         | `"album"`                                |
| `titles_loop` / `tracks_loop` / `playlisttracks_loop` | `"track"`                                |
| `genres_loop`                                         | `"genre"`                                |
| `playlists_loop`                                      | `"playlist"`                             |
| `appss_loop` / `radioss_loop`                         | `"app"`                                  |
| `loop_loop`                                           | `"playlist"` (favorites / app sub-items) |

### Artwork URLs

Artwork is resolved relative to the LMS server base URL (`http://<ip>:<httpport>`):

- **Artists**: `/imageproxy/mai/artist/<id>/image_300x300_f`
- **Albums / Tracks**: `/music/<artwork_track_id>/cover_300x300_o`
- **Apps / Favorites**: icon/image field resolved as relative or absolute URL

---

## Row Grouping

`useLyrionMediaBrowserData` groups items into `BrowserRow[]` for the virtual list:

- **Expandable items** (artists, albums, genres, playlists, categories): batched into rows of `chunkSize` for grid rendering.
- **Tracks**: one item per row (rendered as a list track).
- **Global search**: section title rows interleaved with item rows, grouped by type.

`chunkSize` is 3, 4, or 6 depending on container width (set by an `onLayout` callback in the virtual list).

The `hasNoArtwork` flag is `true` when no item in the current view has a thumbnail — in this case all items render as list tracks regardless of type.

---

## Playback

`playItem(item, enqueue?)` maps to LMS CLI commands:

| Context       | Command                                          | Action parameter                                     |
| ------------- | ------------------------------------------------ | ---------------------------------------------------- |
| Library item  | `playlist loadtracks / addtracks / inserttracks` | `buildPlaylistSearchTerm(item)` (e.g. `album.id=42`) |
| App item      | `<app_cmd> playlist play / insert / add`         | `item_id:<id>`                                       |
| Favorite item | `favorites playlist play / insert / add`         | `item_id:<id>`                                       |

Each item's overlay menu exposes **Play**, **Enqueue** (sub-menu: Play Next / Replace Queue / Add to Queue), and **Browse** (if `can_expand`). The navigation bar's **Play** chip offers the same actions for the current folder.
