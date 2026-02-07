# Using Mediocre Media Player Cards with Lyrion Media Server (LMS)

The Mediocre Media Player Cards offer advanced integration with Lyrion Media Server (LMS) via the Squeezebox Home Assistant integration. This allows you to control playback, manage queues, transfer queues between players, and browse/search your LMS library directly from the card UI.

## Configuration

To enable LMS features, add the `lms_entity_id` option to your card configuration:

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room_lms
lms_entity_id: media_player.living_room_lms
```

- `lms_entity_id`: The entity ID of your LMS player (as provided by the Lyrion LMS integration).

## Features

### 1. Queue Transfer Between Players

- When `lms_entity_id` is configured, the card provides a UI to transfer the active queue between different LMS media players.
- This makes it easy to move playback from one room to another.

### 2. Queue Management (Requires lyrion_cli)

- If the [lyrion_cli integration](https://github.com/peteS-UK/lyrion_cli) is installed, you can:
  - View the current queue
  - Reorder tracks (move up/down)
  - Remove items from the queue
  - Skip to any item in the queue

### 3. Search and Media Browser

- By configuring the `search` and `media_browser` options, you can:
  - Search your LMS library for music, playlists, and more
  - Browse your LMS media library and start playback directly from the card

#### Example with Search and Media Browser

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room
lms_entity_id: media_player.living_room_lms
search:
  - entity_id: media_player.living_room_lms
    media_types:
      - media_type: music
        name: Music
        icon: mdi:music
media_browser:
  - entity_id: media_player.living_room_lms
```
