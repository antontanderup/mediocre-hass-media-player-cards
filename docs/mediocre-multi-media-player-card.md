# Mediocre Multi Media Player Card

A card for controlling and viewing multiple media players at once. Useful for managing several speakers or media devices in a single dashboard view.

## Features
- Display and control multiple media players
- Group/ungroup speakers
- Volume management for each player
- Custom action buttons per player
- Music Assistant integration (if configured)

## Screenshot
<!-- Add screenshot here when available -->

## Configuration
```yaml
type: "custom:mediocre-multi-media-player-card"
entities:
  - media_player.living_room_speaker
  - media_player.kitchen_speaker
  - media_player.bedroom_speaker
```

## Options
| Option      | Type   | Default  | Description                                                  |
| ----------- | ------ | -------- | ------------------------------------------------------------ |
| `entities`  | array  | Required | List of entity IDs to display and control                    |
| `custom_buttons` | array | - | List of custom buttons to display for each player            |
| `ma_entity_id` | string | - | Music Assistant entity id (adds search, if supported)         |

See other card docs for more shared options and configuration patterns.
