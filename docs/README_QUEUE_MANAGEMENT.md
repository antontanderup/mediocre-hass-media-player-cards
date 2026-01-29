# Queue Management in Mediocre Media Player Cards

The Mediocre Media Player Cards support queue management for compatible media player integrations. This allows you to view, reorder, and remove items from the playback queue directly within the card UI.

<img width="407" height="834" alt="image" src="https://github.com/user-attachments/assets/56664397-dacf-4c1d-a6d3-e472a3be6309" />


## Supported Integrations

- **Music Assistant (MA):**
  - Queue management is available if you configure the `ma_entity_id` option and have the [mass_queue integration](https://github.com/droans/mass_queue) installed in your Home Assistant setup.
  - You can view the current queue, skip to any item, reorder tracks, and remove items from the queue.

- **Lyrion Media Server (LMS, Logitech Media Server):**
  - Queue management is available if you configure the `lms_entity_id` option and have the [lyrion_cli integration](https://github.com/peteS-UK/lyrion_cli) installed in your Home Assistant setup.
  - Similar queue controls are available: view, reorder, skip, and remove items.

## How to Enable Queue Management

1. **Music Assistant Example:**

   ```yaml
   type: "custom:mediocre-media-player-card"
   entity_id: media_player.living_room
   ma_entity_id: media_player.living_room_ma
   ```

   Ensure the [mass_queue integration](https://github.com/droans/mass_queue) is installed and configured in Home Assistant.

2. **LMS (Lyrion) Example:*

   ```yaml
   type: "custom:mediocre-media-player-card"
   entity_id: media_player.living_room
   lms_entity_id: media_player.living_room_lms
   ```

  Make sure you are have the [lyrion_cli integration](https://github.com/peteS-UK/lyrion_cli) installed and configured.

## Features

- View the current playback queue
- Skip to any item in the queue
- Reorder items (move up/down)
- Remove items from the queue

## Notes

- Queue management is only available for supported integrations (Music Assistant with mass_queue, or LMS via Lyrion cli).
- If both `ma_entity_id` and `lms_entity_id` are configured and you're using Universal Media Player the card will automatically detect which player is active and display that queue.

