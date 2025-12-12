# Mediocre Multi Media Player Card

A card for controlling and viewing multiple media players at once. Useful for managing several speakers or media devices in a single dashboard view.

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

```yaml
type: "custom:mediocre-multi-media-player-card"
entity_id: media_player.living_room_speaker
mode: card
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

| Option                                   | Type          | Default  | Description                                                                |
| ---------------------------------------- | ------------- | -------- | -------------------------------------------------------------------------- |
| `type`                                   | string        | Required | Lovelace card type (should be `"custom:mediocre-multi-media-player-card"`) |
| `mode`                                   | string        | Required | Display mode: `card` or `panel`                                            |
| `height`                                 | number/string |          | Height of the card (px or any CSS unit)                                    |
| `entity_id`                              | string        | Required | Entity id of the initially selected media player                           |
| `use_art_colors`                         | boolean       |          | Use artwork colors for the card                                            |
| `media_players`                          | array         | Required | List of media player configs (see below)                                   |
| `options.transparent_background_on_home` | boolean       |          | Makes the background transparent when showing the massive player           |

### Each item in `media_players`:

| Option                         | Type    | Description                                                      |
| ------------------------------ | ------- | ---------------------------------------------------------------- |
| `entity_id`                    | string  | The entity ID of the media player                                |
| `custom_buttons`               | array   | List of custom buttons (icon, name, and action config)           |
| `name`                         | string  | Custom name for the player                                       |
| `speaker_group_entity_id`      | string  | Entity ID of the main speaker if different from the media player |
| `can_be_grouped`               | boolean | Whether this player can be grouped                               |
| `ma_entity_id`                 | string  | Music Assistant entity id (adds search)                          |
| `ma_favorite_button_entity_id` | string  | Music Assistant favorite button entity                           |
| `search`                       | object  | Search configuration (see below)                                 |
| `search.enabled`               | boolean | Enables Home Assistant search_media functionality                |
| `search.show_favorites`        | boolean | Shows favorites when no search query has been entered            |
| `search.entity_id`             | string  | Entity ID to search on (optional, falls back to card entity_id)  |
| `search.media_types`           | array   | List of supported media types for search                         |
| `media_browser`                | object  | Media browser configuration (see below)                          |
| `media_browser.enabled`        | boolean | Enables built in media browser                                   |
| `media_browser.entity_id`      | string  | Entity ID to browse (optional, falls back to card entity_id)     |
