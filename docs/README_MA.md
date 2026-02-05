# Using Mediocre Media Player Cards with Music Assistant (MA)

The Mediocre Media Player Cards offer deep integration with [Music Assistant (MA)](https://github.com/music-assistant/music-assistant) for Home Assistant. This enables advanced features such as queue management, search, and browsing your MA library directly from the card UI.

## Configuration

To enable Music Assistant features, add the `ma_entity_id` option to your card configuration:

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room
ma_entity_id: media_player.living_room_ma
```

- `ma_entity_id`: The entity ID of your Music Assistant player (as provided by the Music Assistant integration).

## Features

### 1. Queue Management (Requires mass_queue)

- If the [mass_queue integration](https://github.com/music-assistant/ma-queue) is installed, you can:
  - View the current queue
  - Reorder tracks (move up/down)
  - Remove items from the queue
  - Skip to any item in the queue

### 2. Search

- By simply configuring `ma_entity_id` search will work. No further configuration is needed.

### 3. Search and Media Browser

- By configuring `media_browser` options, you can:
  - Browse your MA media library and start playback directly from the card

#### Example with Search and Media Browser

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room
ma_entity_id: media_player.living_room_ma
media_browser:
  - entity_id: media_player.living_room_ma
```

## Requirements

- [Music Assistant integration](https://github.com/music-assistant/music-assistant) for Home Assistant (provides MA media player entities)
- [mass_queue integration](https://github.com/droans/mass_queue) (optional, but required for full queue management)

## Notes

- If both `ma_entity_id` and other supported entities (e.g., `lms_entity_id`) are configured, the card will show controls for the active player.
- Some features (like queue management) require both the correct entity and the `mass_queue` integration.

---

For more details, see the main [README](../README.md) or the [queue management documentation](./README_QUEUE_MANAGEMENT.md).
