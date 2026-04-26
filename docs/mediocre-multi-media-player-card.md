# Mediocre Multi Media Player Card

A card for controlling and viewing multiple media players at once. Useful for managing several speakers or media devices in a single dashboard view.

Comes in two sizes:

- **`large`** — Full-featured view with a massive player, tabs for search, queue, media browser, and speaker grouping.
- **`compact`** — A single compact card (visually similar to the [Mediocre Media Player Card](./mediocre-media-player-card.md)) that displays the active player. Secondary actions (grouping, search, queue, media browser) open as modals.

## Features

- Display and control multiple media players
- Group/ungroup speakers
- Volume management for each player
- Custom action buttons per player
- Media Browser
- Music Assistant integration (if configured)

## Screenshots

<img width="396" height="781" alt="image" src="https://github.com/user-attachments/assets/f0587495-6ae9-463e-b3e5-41f328b25199" />
<img width="396" height="781" alt="image" src="https://github.com/user-attachments/assets/81c07474-0bf6-4065-bec9-6fb598f2b028" />
<img width="396" height="781" alt="image" src="https://github.com/user-attachments/assets/02bfd0b0-9e0e-4c29-bf3d-f90e7228dd2e" />
<img width="396" height="781" alt="image" src="https://github.com/user-attachments/assets/3ff26200-4e37-4d28-bbeb-249e016d84df" />

## Configuration

### Large (full-featured)

```yaml
type: "custom:mediocre-multi-media-player-card"
size: large
mode: card
entity_id: media_player.living_room_speaker
media_players:
  - entity_id: media_player.living_room_speaker
    name: Living Room
  - entity_id: media_player.kitchen_speaker
    name: Kitchen
  - entity_id: media_player.bedroom_speaker
    name: Bedroom
```

### Compact

```yaml
type: "custom:mediocre-multi-media-player-card"
size: compact
entity_id: media_player.living_room_speaker
media_players:
  - entity_id: media_player.living_room_speaker
    name: Living Room
    custom_buttons:
      - icon: mdi:playlist-music
        name: Playlists
        # ...action config...
  - entity_id: media_player.kitchen_speaker
    name: Kitchen
  - entity_id: media_player.bedroom_speaker
    name: Bedroom
```

## Options

| Option                                        | Type    | Default  | Description                                                                                                                                                                                |
| --------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`                                        | string  | Required | Lovelace card type (should be `"custom:mediocre-multi-media-player-card"`)                                                                                                                 |
| `size`                                        | string  | Required | Card size: `large` (full multi-player panel) or `compact` (single compact card showing the active player)                                                                                  |
| `entity_id`                                   | string  | Required | Entity ID of the initially selected / active media player                                                                                                                                  |
| `use_art_colors`                              | boolean |          | Use artwork colors for the card                                                                                                                                                            |
| `disable_player_focus_switching`              | boolean |          | Disable automatic switching of the focused player when playback starts                                                                                                                     |
| `media_players`                               | array   | Required | List of media player configs (see below)                                                                                                                                                   |
| `options.player_is_active_when`               | string  |          | When to consider a player active: `playing` or `playing_or_paused`                                                                                                                         |
| `options.show_volume_step_buttons`            | boolean |          | Show volume `+`/`-` step buttons on volume sliders                                                                                                                                         |
| `options.use_volume_up_down_for_step_buttons` | boolean |          | Use `volume_up`/`volume_down` services for step buttons instead of `set_volume`                                                                                                            |
| `options.use_experimental_lms_media_browser`  | boolean |          | Replace the built-in media browser with an experimental lyrion_cli-based browser that includes global search and app access (e.g. Spotty, Qobuz). Requires `lms_entity_id` and lyrion_cli. |

### Size-specific options (`size: large`)

| Option                                   | Type          | Default  | Description                                                                                                    |
| ---------------------------------------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `mode`                                   | string        | Required | Display mode: `card`, `in-card`, or `panel`                                                                    |
| `height`                                 | number/string |          | Height of the card (px or any CSS unit)                                                                        |
| `options.transparent_background_on_home` | boolean       |          | Makes the background transparent when showing the massive player                                               |
| `options.hide_selected_player_header`    | boolean       |          | Hide the header of the selected player in the massive view                                                     |
| `options.default_tab`                    | string        |          | Tab to show by default: `massive`, `search`, `media-browser`, `speaker-grouping`, `custom-buttons`, or `queue` |

### Size-specific options (`size: compact`)

| Option                               | Type    | Default | Description                                                  |
| ------------------------------------ | ------- | ------- | ------------------------------------------------------------ |
| `tap_opens_popup`                    | boolean |         | Tapping the card opens a popup with the massive card         |
| `options.always_show_power_button`   | boolean |         | Always show the power button, even if the media player is on |
| `options.always_show_custom_buttons` | boolean |         | Always show custom buttons panel expanded                    |
| `options.hide_when_off`              | boolean |         | Hide the card when the active player is off                  |
| `options.hide_when_group_child`      | boolean |         | Hide the card when the active player is a group child        |

### Each item in `media_players`

| Option                         | Type    | Description                                                                                         |
| ------------------------------ | ------- | --------------------------------------------------------------------------------------------------- |
| `entity_id`                    | string  | The entity ID of the media player                                                                   |
| `custom_buttons`               | array   | List of custom buttons (icon, name, and action config)                                              |
| `name`                         | string  | Custom name for the player                                                                          |
| `speaker_group_entity_id`      | string  | Entity ID of the main speaker if different from the media player                                    |
| `can_be_grouped`               | boolean | Whether this player can be grouped                                                                  |
| `ma_entity_id`                 | string  | Music Assistant entity id (adds search and queue management when paired with hass_queue)            |
| `ma_favorite_button_entity_id` | string  | Music Assistant favorite button entity                                                              |
| `lms_entity_id`                | string  | LMS (lyrion) entity id. Adds queue transfer and queue management when paired with lyrion_cli.       |
| `search`                       | array   | List of objects (entity_id, name and media_types). Enables search ui using the search_media action. |
| `media_browser`                | array   | List of objects (entity_id and name). Enables a built in media browser.                             |
