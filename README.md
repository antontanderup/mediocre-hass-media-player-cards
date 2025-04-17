# Mediocre Media Player Cards

<img src="https://github.com/user-attachments/assets/ac81afa5-205f-430b-ba3a-d488e329f112" width="500px" alt="Mediocre Media Player Card Screenshot 1" />

A bunch of custom media player cards for Home Assistant that let you group speakers and do some custom actions.

> **Note:** This is a prerelease version, so you might encounter some bugs.

## Installation

### HACS

1. Open HACS in your Home Assistant instance
2. Click the three dots in the top right corner
3. Select "Custom repositories"
4. Add `antontanderup/mediocre-hass-media-player-cards` as a repository
5. Set category to "Dashboard"
6. Click "Add"
7. Search for "Mediocre Hass Media Player Cards"
8. Install it and reload your browser

### Manual Installation

1. Grab the latest release from the [releases page](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
2. Copy the JavaScript file to your `www/` directory in your Home Assistant setup
3. Add the resource to your Lovelace config:

```yaml
resources:
  - url: /local/mediocre-media-player-card.js
    type: module
```

4. Refresh your browser

## Available Cards

### Mediocre Media Player Card

A standard-sized media player card with speaker grouping support that fits nicely in dashboards.

<img src="https://github.com/user-attachments/assets/2178b5d4-ea8f-46cf-9737-149e1da935c5" width="500px" alt="Mediocre Media Player Card Screenshot 3" />
<img src="https://github.com/user-attachments/assets/dd94d59e-258e-4195-9b9c-4e5b2b9ae9a1" width="500px" alt="Mediocre Media Player Card Screenshot 2" />

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

A full-sized media player card that can be used in various modes. It provides an immersive media control experience with all features at a glance and can be displayed as a regular card (mode: card), embedded in other cards (mode: in-card), or used in panel view (mode: panel).

<img src="https://github.com/user-attachments/assets/8340e509-c7af-4a10-bbb1-8b8086a87e57" width="500px" alt="Mediocre Massive Media Player Card Screenshot" />

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

## Configuration Options

Both cards support these options:

| Option                    | Type   | Default  | Description                                                      |
| ------------------------- | ------ | -------- | ---------------------------------------------------------------- |
| `entity_id`               | string | Required | The entity ID of the media player                                |
| `action`                  | object | -        | Configuration for tap actions                                    |
| `speaker_group`           | object | -        | Configuration for speaker grouping                               |
| `speaker_group.entity_id` | string | -        | Entity ID of the main speaker if different from the media player |
| `speaker_group.entities`  | array  | -        | List of entity IDs that can be grouped with the main speaker     |
| `custom_buttons`          | array  | -        | List of custom buttons to display                                |

The Mediocre Media Player Card has additional options:

| Option            | Type    | Default | Description                                                            |
| ----------------- | ------- | ------- | ---------------------------------------------------------------------- |
| `tap_opens_popup` | boolean | `false` | When set to true, tapping the card opens a popup with the massive card |

The Mediocre Massive Media Player Card has additional options:

| Option | Type   | Default | Description                                                                                            |
| ------ | ------ | ------- | ------------------------------------------------------------------------------------------------------ |
| `mode` | string | `card`  | Display mode: `card` (regular HA card), `in-card` (no card wrapper), or `panel` (panel optimized view) |

> **Note:** When `tap_opens_popup` is set to true on the regular Media Player Card, it will display the Massive Media Player Card in a popup.

### Action Configuration

```yaml
action:
  tap_action:
    action: navigate
    navigation_path: /media-player/living-room
```

### Custom Buttons

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
