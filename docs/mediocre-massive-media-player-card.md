# Mediocre Massive Media Player Card

A full-sized media player card for Home Assistant. Supports grouping speakers, custom action buttons, and search (when used with Music Assistant). Shares most configuration options with the standard card.

## Features

- Group/ungroup speakers
- Volume management for groups
- Custom action buttons
- Music Assistant search integration
- Visual editor for configuratio
- Media Browser
- Multiple display modes: card, in-card, panel

## Screenshot

<img width="396" height="696" alt="image" src="https://github.com/user-attachments/assets/2263c11c-9666-4c97-8419-584e53b72e2a" />
<img width="396" height="696" alt="image" src="https://github.com/user-attachments/assets/42c88548-e34b-4056-96ec-6a38fd0ca49c" />
<img width="396" height="696" alt="image" src="https://github.com/user-attachments/assets/584d07ad-9d31-4dc1-9a25-68d7171a93d4" />
<img width="396" height="696" alt="image" src="https://github.com/user-attachments/assets/a27759ea-e785-4598-96a4-7dc9339ff7e5" />

## Configuration

```yaml
type: "custom:mediocre-massive-media-player-card"
entity_id: media_player.living_room_speaker
mode: card # Options: card, in-card, panel
speaker_group:
  entities:
    - media_player.kitchen_speaker
    - media_player.bedroom_speaker
```

## Options

| Option                               | Type    | Default  | Description                                                                                             |
| ------------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `type`                               | string  | Required | Lovelace card type (should be `"custom:mediocre-massive-media-player-card"`)                            |
| `entity_id`                          | string  | Required | The entity ID of the media player                                                                       |
| `use_art_colors`                     | boolean |          | Use artwork colors for the card                                                                         |
| `action`                             | object  |          | Tap/hold/double_tap action configuration (see actionTypes)                                              |
| `speaker_group`                      | object  |          | Speaker grouping configuration                                                                          |
| `speaker_group.entity_id`            | string  |          | Entity ID of the main speaker if different from the media player                                        |
| `speaker_group.entities`             | array   |          | List of entity IDs that can be grouped with the main speaker                                            |
| `custom_buttons`                     | array   |          | List of custom buttons (icon, name, and action config)                                                  |
| `ma_entity_id`                       | string  |          | Music Assistant entity id (adds search and queue management when paired with hass_queue)                |
| `ma_favorite_button_entity_id`       | string  |          | Music Assistant favorite button entity (shows a heart-plus button to mark the current song as favorite) |
| `lms_entity_id`                      | string  |          | LMS (lyrion) entity id. Adds queue transfer and queue management when paired with lyrion_cli.           |
| `search`                             | array   |          | List of objects (entity_id, name and media_types). Enables search ui using the search_media action.     |
| `media_browser`                      | array   |          | List of objects (entity_id and name). Enables a built in media browser.                                 |
| `options`                            | object  |          | Additional display options                                                                              |
| `options.always_show_power_button`   | boolean |          | Always show the power button, even if the media player is on                                            |
| `options.always_show_custom_buttons` | boolean |          | Always show custom buttons panel expanded                                                               |
| `options.hide_when_off`              | boolean |          | Hide the card when the media player is off                                                              |
| `options.hide_when_group_child`      | boolean |          | Hide the card when the media player is a group child                                                    |
| `tap_opens_popup`                    | boolean |          | When set to true, tapping the card opens a popup with the massive card                                  |
| `mode`                               | string  | `card`   | Display mode: `card` (regular HA card), `in-card` (no card wrapper), or `panel` (panel optimized view)  |
