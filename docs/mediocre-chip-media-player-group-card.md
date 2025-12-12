# Mediocre Chip Media Player Group Card

A compact chip-style card for quickly grouping/ungrouping speakers. Perfect for dashboards where space is limited but you need quick access to speaker controls.

## Features

- Quickly group/ungroup speakers
- Compact chip UI
- Designed for dashboards with limited space

## Screenshot

![Mediocre Chip Media Player Group Card Screenshot](https://github.com/user-attachments/assets/96d2691c-e636-432a-87d9-f7dc33570ea6)

## Configuration

```yaml
type: "custom:mediocre-chip-media-player-group-card"
entity_id: media_player.living_room_speaker
entities:
  - media_player.kitchen_speaker
  - media_player.bedroom_speaker
  - media_player.bathroom_speaker
```

## Options

| Option      | Type   | Default  | Description                                                  |
| ----------- | ------ | -------- | ------------------------------------------------------------ |
| `entity_id` | string | Required | The entity ID of the main media player to group others with  |
| `entities`  | array  | Required | List of entity IDs that can be grouped with the main speaker |
