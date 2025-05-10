# Search Functionality with Mediocre Media Player Cards
![image](https://github.com/user-attachments/assets/2cc64202-a8da-44e1-a7a7-df3941a3ff38)

The Mediocre Media Player Cards support search functionality when used with a Music Assistant player. By specifying the `ma_entity_id` option, you can enable search features directly within the card.

## Configuration Example

Here is an example configuration to enable Music Assistant search:

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room
ma_entity_id: media_assistant.living_room_ma
```

### Explanation

- `entity_id`: Set this to the media player entity ID (e.g., `media_player.living_room`). This can also just be the Music Assistant media player entity.
- `ma_entity_id`: Specify the Music Assistant entity ID (e.g., `media_assistant.living_room_ma`). This enables Music Assistant-specific features, including search. You need to specify this even if your main entity_id is the same as your Music Assistant entity_id. This allows you to use the card with a different entity_id than your Music Assistant but trigger actions on a Music Assistant entity.

## How to Use Search

Once configured, the card will display a search button that opens the search ui. You can use this to search for music, playlists, or other media available through Music Assistant.

## media_player.search_media (coming soon)

Search using media_player.search_media (allows searching with any media_player that supports the action: media_player.search_media).
This will make the search action available on all media players that support it. This is a more generic search action that can be used with any media player, not just Music Assistant.
