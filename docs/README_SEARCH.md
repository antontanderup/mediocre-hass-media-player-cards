# Search Functionality with Mediocre Media Player Cards

![image](https://github.com/user-attachments/assets/2cc64202-a8da-44e1-a7a7-df3941a3ff38)

The Mediocre Media Player Cards support search functionality when used with a Music Assistant player and other media players. By specifying the `ma_entity_id` option, you can enable Music Assistant-specific search features directly within the card. Alternatively, enabling the `search.enabled` option will use the regular Home Assistant `search_media` functionality.

## Configuration Example

Here is an example configuration to enable search with Music Assistant:

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room
ma_entity_id: media_player.living_room_ma
```

And here is an example configuration to enable search with search_media:

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room
search:
  - entity_id: media_player.living_room
    media_types:
      - media_type: music
        name: Music
        icon: mdi:music
      - media_type: playlist
        name: Playlists
        icon: mdi:playlist-music
```

### Explanation

- `entity_id`: Set this to the media player entity ID (e.g., `media_player.living_room`).
- `ma_entity_id`: Specify the Music Assistant entity ID (e.g., `media_player.living_room_ma`). This enables Music Assistant-specific features, including search. If this is present, search will automatically work using Music Assistant (no need for further configuration).
- `search`: This is an array of search configurations. Each entry can specify an `entity_id` and a list of supported `media_types` (with optional `name` and `icon`). If multiple configs are here you can pick between them in the UI.

## How to Use Search

Once configured, the card will display a search button that opens the search UI. You can use this to search for music, playlists, or other media available depending on your configuration.
