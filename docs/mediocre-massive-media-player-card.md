# Mediocre Massive Media Player Card

A full-sized media player card for Home Assistant. Supports grouping speakers, custom action buttons, and search (when used with Music Assistant). Shares most configuration options with the standard card.

## Features
- Group/ungroup speakers
- Volume management for groups
- Custom action buttons
- Music Assistant search integration
- Visual editor for configuration
- Multiple display modes: card, in-card, panel

## Screenshot
![Mediocre Massive Media Player Card Screenshot](https://github.com/user-attachments/assets/793f9b8f-032b-4309-b8ef-1f38935e448a)

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
| Option | Type   | Default | Description                                                                                            |
| ------ | ------ | ------- | ------------------------------------------------------------------------------------------------------ |
| `mode` | string | `card`  | Display mode: `card` (regular HA card), `in-card` (no card wrapper), or `panel` (panel optimized view) |

See [Mediocre Media Player Card](./mediocre-media-player-card.md) for shared options.
