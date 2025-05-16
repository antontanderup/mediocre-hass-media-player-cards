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

And here is an example configuration to enable search with a search_media enabled media player:

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room
search:
  enabled: true
```

### Explanation

- `entity_id`: Set this to the media player entity ID (e.g., `media_player.living_room`). This can also just be the Music Assistant media player entity.
- `ma_entity_id`: Specify the Music Assistant entity ID (e.g., `media_player.living_room_ma`). This enables Music Assistant-specific features, including search. If this is present, search will automatically work using Music Assistant (no need for further configuration).
- `search.enabled`: Set this to `true` to enable the regular Home Assistant `search_media` functionality. If `ma_entity_id` is also specified, Music Assistant search will take precedence.
- `search.entity_id`: If you want to use a different entity for search, you can specify it here. This is useful if you want to use a different media player for search functionality (when using universal media player).

## How to Use Search

Once configured, the card will display a search button that opens the search UI. You can use this to search for music, playlists, or other media available depending on your configuration.
