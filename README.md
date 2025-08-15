# 🎵 Mediocre Media Player Cards
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![GitHub Release](https://img.shields.io/github/v/release/antontanderup/mediocre-hass-media-player-cards?color=blue)](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
[![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/antontanderup/mediocre-hass-media-player-cards/total)](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
[![Chat on Oase](https://img.shields.io/badge/Chat-Oase-lightblue?color=rgb(74%20196%20169))](https://oase.app/oase/8414e128-52fe-42c7-b7c8-789fd0930a3e/join/cfdc211d-eb53-4cef-af62-2d1c4642a180)
<br/>

<img src="https://github.com/user-attachments/assets/2ba5d55d-6fd3-4508-ae1c-60d9f22ebe81" width="500px" alt="Mediocre Media Player Card Screenshot 1" />

Media player cards for Home Assistant that let you group speakers, add custom action buttons, search for music and more. A visual editor is available for all media player card configuration options.

> **Note:** This is a pretty new project, so you might encounter some bugs. If you do, please do report them.

## Installation

<details>
<summary>HACS</summary>

1. Open HACS in your Home Assistant instance
2. Click the three dots in the top right corner
3. Select "Custom repositories"
4. Add `antontanderup/mediocre-hass-media-player-cards` as a repository
5. Set category to "Dashboard"
6. Click "Add"
7. Search for "Mediocre Hass Media Player Cards"
8. Install it and reload your browser

</details>

<details>
<summary>Manual Installation</summary>

1. Grab the latest release from the [releases page](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
2. Copy the JavaScript file to your `www/` directory in your Home Assistant setup
3. Add the resource to your Lovelace config:

```yaml
resources:
  - url: /local/mediocre-media-player-card.js
    type: module
```

4. Refresh your browser

</details>

## Available Cards

### Mediocre Media Player Card

A standard-sized media player card. Supports grouping speakers (including volume management), custom action buttons, and search (when used with Music Assistant).

<img src="https://github.com/user-attachments/assets/a4ad8f2c-aafe-424f-9626-ff3353cbd605" width="500px" alt="Mediocre Media Player Card Screenshot 2" />

#### Configuration

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room_speaker
tap_opens_popup: true
speaker_group:
  entities:
    - media_player.kitchen_speaker
    - media_player.bedroom_speaker
```

### Mediocre Massive Media Player Card

A full-sized media player card. Just like the regular card it supports grouping speakers (including volume management), custom action buttons, and search (when used with Music Assistant). In fact they share most of the configuration options.

<img src="https://github.com/user-attachments/assets/793f9b8f-032b-4309-b8ef-1f38935e448a" width="500px" alt="Mediocre Massive Media Player Card Screenshot" />

#### Configuration

```yaml
type: "custom:mediocre-massive-media-player-card"
entity_id: media_player.living_room_speaker
mode: card # Options: card, in-card, panel
speaker_group:
  entities:
    - media_player.kitchen_speaker
    - media_player.bedroom_speaker
```

## Shared Configuration Options

Both cards support these options:

| Option                    | Type   | Default  | Description                                                      |
| ------------------------- | ------ | -------- | ---------------------------------------------------------------- |
| `entity_id`               | string | Required | The entity ID of the media player                                |
| `action`                  | object | -        | Configuration for tap actions                                    |
| `speaker_group`           | object | -        | Configuration for speaker grouping                               |
| `speaker_group.entity_id` | string | -        | Entity ID of the main speaker if different from the media player |
| `speaker_group.entities`  | array  | -        | List of entity IDs that can be grouped with the main speaker     |
| `custom_buttons`          | array  | -        | List of custom buttons to display                                |
| `ma_entity_id`            | string | -        | Music Assistant entity id (adds search)                          |
| `ma_favorite_button_entity_id` | string | - | Music Assistant favorite button entity (shows a heart-plus button to mark the current song as favorite) |
| `options`                 | object | -        | Additional display options for fine-tuning the card              |
| `options.always_show_power_button` | boolean | `false` | Always show the power button, even if the media player is on |

The Mediocre Media Player Card has additional options:

| Option            | Type    | Default | Description                                                            |
| ----------------- | ------- | ------- | ---------------------------------------------------------------------- |
| `tap_opens_popup` | boolean | `false` | When set to true, tapping the card opens a popup with the massive card |
| `options.always_show_custom_buttons` | boolean | `false` | Always show custom buttons panel expanded |

The Mediocre Massive Media Player Card has additional options:

| Option | Type   | Default | Description                                                                                            |
| ------ | ------ | ------- | ------------------------------------------------------------------------------------------------------ |
| `mode` | string | `card`  | Display mode: `card` (regular HA card), `in-card` (no card wrapper), or `panel` (panel optimized view) |

### Action Configuration

```yaml
action:
  tap_action:
    action: navigate
    navigation_path: /media-player/living-room
```

### Custom Buttons

![image](https://github.com/user-attachments/assets/5cb62175-25fc-4594-a003-89a801320aba)

You can add custom buttons with specific actions:

```yaml
custom_buttons:
  - icon: mdi:playlist-music
    name: Playlists
    tap_action:
      action: navigate
      navigation_path: /media-player/playlists
  - icon: mdi:equalizer
    name: Equalizer
    tap_action:
      action: perform-action
      perform_action: media_player.open_equalizer
      target:
        entity_id: media_player.living_room_speaker
      data: {}
```

## Music Assistant Integration

![image](https://github.com/user-attachments/assets/83ae321a-3abf-4e73-8493-6ef54efa5140)

Both the Mediocre Media Player Card and the Mediocre Massive Media Player Card support Music Assistant. By specifying a `ma_entity_id`, you can enable Music Assistant-specific features (currently just search). Even if your main entity_id is the same as your music assistant entity_id you need to specify it in the `ma_entity_id`. This allows you to use the card with a different entity_id than your music assistant but trigger actions on a music assistant entity.

### Configuration


```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room_musiccast
ma_entity_id: media_player.living_room_musicassistant
ma_favorite_button_entity_id: button.living_room_favorite
```

| Option         | Type   | Default | Description                                 |
| -------------- | ------ | ------- | ------------------------------------------- |
| `ma_entity_id` | string | -       | The entity ID of the Music Assistant player |

### Mediocre Chip Media Player Group Card

A compact chip-style card for quickly grouping/ungrouping speakers. Perfect for dashboards where space is limited but you need quick access to speaker controls.

<img src="https://github.com/user-attachments/assets/96d2691c-e636-432a-87d9-f7dc33570ea6" width="500px" alt="Mediocre Chip Media Player Group Card Screenshot" />

#### Configuration

```yaml
type: "custom:mediocre-chip-media-player-group-card"
entity_id: media_player.living_room_speaker
entities:
  - media_player.kitchen_speaker
  - media_player.bedroom_speaker
  - media_player.bathroom_speaker
```

#### Configuration Options

| Option      | Type   | Default  | Description                                                  |
| ----------- | ------ | -------- | ------------------------------------------------------------ |
| `entity_id` | string | Required | The entity ID of the main media player to group others with  |
| `entities`  | array  | Required | List of entity IDs that can be grouped with the main speaker |

## Search Functionality

Both the Mediocre Media Player Card and the Mediocre Massive Media Player Card support search functionality. By specifying a `ma_entity_id`, you can enable Music Assistant-specific search features directly within the card. Alternatively, enabling the `search.enabled` option will use the regular Home Assistant `search_media` functionality. Read more about configuring the cards for search [here](./docs/README_SEARCH.md).

## Additional Documentation

- [Using Universal Media Player with Mediocre Media Player Cards](./docs/README_UMP.md)
- [Search Functionality with Mediocre Media Player Cards](./docs/README_SEARCH.md)

## Troubleshooting

If you run into issues:

1. Check that your entity supports the media player features needed
2. Verify your configuration syntax
3. Look for errors in your browser's developer console

## Development

These cards are built with Preact wrapped in web components. For local development:

```bash
# Install dependencies
yarn install

# Build for development
yarn dev

# Continually build when files change
yarn dev:watch

# Build for production
yarn build
```

When using `yarn dev`, the output file will be named `mediocre-hass-media-player-cards-dev.js` instead of `mediocre-hass-media-player-cards.js`.

You can also create a `.env.development` file (based on the `.env.development.example`) to use custom component names during development. This is usefull if you want to test in a live environment without risking breaking anything for your users (family members :D).
