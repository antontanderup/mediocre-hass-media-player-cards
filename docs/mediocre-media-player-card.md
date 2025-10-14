# Mediocre Media Player Card

A standard-sized media player card for Home Assistant. Supports grouping speakers (including volume management), custom action buttons, and search (when used with Music Assistant).

## Features
- Group/ungroup speakers
- Volume management for groups
- Custom action buttons
- Music Assistant search integration
- Visual editor for configuration

## Screenshot
![Mediocre Media Player Card Screenshot](https://github.com/user-attachments/assets/a4ad8f2c-aafe-424f-9626-ff3353cbd605)

## Configuration
```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room_speaker
tap_opens_popup: true
speaker_group:
  entities:
    - media_player.kitchen_speaker
    - media_player.bedroom_speaker
```


## Options
| Option                             | Type                | Default  | Description                                                                                             |
|-------------------------------------|---------------------|----------|---------------------------------------------------------------------------------------------------------|
| `type`                             | string              | Required | Lovelace card type (should be `"custom:mediocre-media-player-card"`)                                    |
| `entity_id`                        | string              | Required | The entity ID of the media player                                                                       |
| `use_art_colors`                   | boolean             |          | Use artwork colors for the card                                                                         |
| `action`                           | object              |          | Tap/hold/double_tap action configuration (see actionTypes)                                              |
| `speaker_group`                    | object              |          | Speaker grouping configuration                                                                          |
| `speaker_group.entity_id`          | string         |          | Entity ID of the main speaker if different from the media player                                        |
| `speaker_group.entities`           | array               |          | List of entity IDs that can be grouped with the main speaker                                            |
| `custom_buttons`                   | array               |          | List of custom buttons (icon, name, and action config)                                                  |
| `ma_entity_id`                     | string         |          | Music Assistant entity id (adds search)                                                                 |
| `ma_favorite_button_entity_id`     | string         |          | Music Assistant favorite button entity (shows a heart-plus button to mark the current song as favorite) |
| `search`                           | object              |          | Search configuration                                                                                    |
| `search.enabled`                   | boolean        |          | Enables Home Assistant search_media functionality                                                       |
| `search.show_favorites`            | boolean        |          | Shows favorites when no search query has been entered                                                   |
| `search.entity_id`                 | string         |          | Entity ID to search on (optional, falls back to card entity_id)                                         |
| `search.media_types`               | array               |          | List of supported media types for search                                                                |
| `options`                          | object              |          | Additional display options                                                                              |
| `options.always_show_power_button` | boolean        |          | Always show the power button, even if the media player is on                                            |
| `options.always_show_custom_buttons`| boolean        |          | Always show custom buttons panel expanded                                                               |
| `options.hide_when_off`            | boolean        |          | Hide the card when the media player is off                                                              |
| `options.hide_when_group_child`    | boolean        |          | Hide the card when the media player is a group child                                                    |
| `tap_opens_popup`                  | boolean             |          | When set to true, tapping the card opens a popup with the massive card                                  |

