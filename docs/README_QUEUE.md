# Queue Functionality with Mediocre Media Player Cards

The Mediocre Media Player Cards can display the current playback queue when used with Music Assistant. To enable this feature, first install the [`mass_queue`](https://github.com/droans/mass_queue) custom component for Home Assistant, which exposes Music Assistant's queue to Home Assistant.

## Configuration Example

To enable the queue, specify a `ma_entity_id` and set `queue.enabled` to `true`:

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room
ma_entity_id: media_player.living_room_ma
queue:
  enabled: true
```

### Explanation

- `ma_entity_id`: Music Assistant entity ID. Required for accessing the queue.
- `queue.enabled`: Set to `true` to show the current queue in the card.

Once configured, the card will display a queue button that opens the list of upcoming items, similar to the search interface.
