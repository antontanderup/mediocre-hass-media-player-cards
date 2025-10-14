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
| Option                             | Type    | Default  | Description                                                                                             |
| ---------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `entity_id`                        | string  | Required | The entity ID of the media player                                                                       |
| `action`                           | object  | -        | Configuration for tap actions                                                                           |
| `speaker_group`                    | object  | -        | Configuration for speaker grouping                                                                      |
| `speaker_group.entity_id`          | string  | -        | Entity ID of the main speaker if different from the media player                                        |
| `speaker_group.entities`           | array   | -        | List of entity IDs that can be grouped with the main speaker                                            |
| `custom_buttons`                   | array   | -        | List of custom buttons to display                                                                       |
| `ma_entity_id`                     | string  | -        | Music Assistant entity id (adds search)                                                                 |
| `ma_favorite_button_entity_id`     | string  | -        | Music Assistant favorite button entity (shows a heart-plus button to mark the current song as favorite) |
| `options`                          | object  | -        | Additional display options for fine-tuning the card                                                     |
| `options.always_show_power_button` | boolean | `false`  | Always show the power button, even if the media player is on                                            |
| `tap_opens_popup`                  | boolean | `false`  | When set to true, tapping the card opens a popup with the massive card                                  |
| `options.always_show_custom_buttons` | boolean | `false` | Always show custom buttons panel expanded                                                               |
