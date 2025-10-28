# Using Universal Media Player with Mediocre Media Player Cards

Want to use Universal Media Player but also want to group players? This is how.
Universal Media Player allows you to control multiple media players as a single entity. This is nice if you use multiple sources and want to use a single entity to control them all. However, it does not support grouping of players. This is where the Mediocre Media Player Card comes in.

## Configuration Example

Here is an example configuration for using a Universal Media Player:

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room_universal
speaker_group:
  entity_id: media_player.living_room
  entities:
    - media_player.living_room
    - media_player.kitchen
    - media_player.bedroom
```

### Explanation

- `entity_id`: Set this to the Universal Media Player entity ID (e.g., `media_player.living_room_universal`).
- `speaker_group.entity_id`: Specify the main media player entity ID for grouping (e.g., `media_player.living_room`).
- `speaker_group.entities`: List the entity IDs of the speakers that can be grouped with the main media player.

This setup allows you to use the Universal Media Player for playback control while managing speaker grouping with a different media player entity.

### Example UMP configuration.yaml

In your `configuration.yaml`, you can set up the Universal Media Player something like this:

```yaml
media_player:
  - platform: universal
    name: Living Room
    device_class: receiver
    unique_id: living_room_universal
    children:
      - media_player.living_room
      - media_player.living_room_lms
      - media_player.living_room_ma
    active_child_template: >
      {% if is_state_attr('media_player.living_room', 'source', 'AUX') %}
        media_player.living_room_lms
      {% elif not is_state("media_player.living_room_ma", "off") and state_attr("media_player.living_room_ma", "media_title") == state_attr("media_player.living_room", "media_title") -%}
        media_player.living_room_ma
      {% else %}
        media_player.living_room
      {% endif %}
    commands:
      volume_set:
        action: media_player.volume_set
        target:
          entity_id: media_player.living_room
        data:
          volume_level: "{{ volume_level }}"
    attributes:
      volume_level: media_player.living_room|volume_level
```

In this case if the source is AUX it will use the LMS player (connected to the AUX input). If the music assistant player is not off and playing the same media as the main player it will use that. Otherwise it will use the main player (reciever or speaker).
This let's you get the best possible meta data from the sources, while still only controlling one entity. This way you also avoid having to do a bunch of conditional rendering on your dashboard.
