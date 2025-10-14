# 🎵 Mediocre Media Player Cards

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![GitHub Release](https://img.shields.io/github/v/release/antontanderup/mediocre-hass-media-player-cards?color=blue)](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
[![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/antontanderup/mediocre-hass-media-player-cards/total)](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
[![Chat on Oase](<https://img.shields.io/badge/Chat-Oase-lightblue?color=rgb(74%20196%20169)>)](https://oase.app/oase/8414e128-52fe-42c7-b7c8-789fd0930a3e/join/cfdc211d-eb53-4cef-af62-2d1c4642a180)
→ [Read full documentation](./docs/mediocre-media-player-card.md)



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

→ [Read full documentation](./docs/mediocre-massive-media-player-card.md)

### 🎚️ Mediocre Media Player Card

A standard-sized media player card for a single entity. Supports grouping, custom actions, and Music Assistant integration.

<img src="https://github.com/user-attachments/assets/a4ad8f2c-aafe-424f-9626-ff3353cbd605" width="400px" alt="Mediocre Media Player Card Screenshot" />
→ [Read full documentation](./docs/mediocre-multi-media-player-card.md)
→ [Read full documentation](./src/cards/mediocre-media-player-card/README.md)
---

### 🖼️ Mediocre Massive Media Player Card

A full-sized, feature-rich card for a single media player. Includes all features of the standard card, plus multiple display modes.

→ [Read full documentation](./docs/mediocre-chip-media-player-group-card.md)


---

Control and view multiple media players at once. Great for dashboards with several speakers or grouped devices.

<!-- Add screenshot here when available -->

→ [Read full documentation](./src/cards/mediocre-multi-media-player-card/README.md)

---

### 🎛️ Mediocre Chip Media Player Group Card

A compact chip-style card for quickly grouping/ungrouping speakers. Perfect for dashboards where space is limited.

<img src="https://github.com/user-attachments/assets/96d2691c-e636-432a-87d9-f7dc33570ea6" width="400px" alt="Mediocre Chip Media Player Group Card Screenshot" />

→ [Read full documentation](./src/cards/mediocre-chip-media-player-group-card/README.md)

---

## More Features & Documentation

- [Universal Media Player integration](./docs/README_UMP.md)
- [Search functionality](./docs/README_SEARCH.md)

## Troubleshooting

If you run into issues:

1. Check that your entity supports the media player features needed
2. Verify your configuration syntax
3. Look for errors in your browser's developer console

## Development

These cards are built with Preact wrapped in web components. For local development:

```bash
# Install dependencies


# Build for development
- [Using Universal Media Player with Mediocre Media Player Cards](./docs/README_UMP.md)

# Continually build when files change
- [Search Functionality with Mediocre Media Player Cards](./docs/README_SEARCH.md)

# Build for production

```

When using `yarn dev`, the output file will be named `mediocre-hass-media-player-cards-dev.js` instead of `mediocre-hass-media-player-cards.js`.

You can also create a `.env.development` file (based on the `.env.development.example`) to use custom component names during development. This is useful if you want to test in a live environment without risking breaking anything for your users (family members :D).
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
