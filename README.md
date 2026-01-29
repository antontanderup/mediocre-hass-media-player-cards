# 🎵 Mediocre Media Player Cards

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![GitHub Release](https://img.shields.io/github/v/release/antontanderup/mediocre-hass-media-player-cards?color=blue)](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
[![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/antontanderup/mediocre-hass-media-player-cards/total)](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
[![Chat on Oase](<https://img.shields.io/badge/Chat-Oase-lightblue?color=rgb(74%20196%20169)>)](https://oase.app/oase/8414e128-52fe-42c7-b7c8-789fd0930a3e/join/cfdc211d-eb53-4cef-af62-2d1c4642a180)
[![BuyMeACoffee](https://raw.githubusercontent.com/pachadotdev/buymeacoffee-badges/main/bmc-yellow.svg)](https://www.buymeacoffee.com/antontadamsen)

Media player cards for Home Assistant that let you group speakers, add custom action buttons, browse, search for music, manage your queue and more. A visual editor is available for all media player card configuration options.

## Installation

<details>
<summary>HACS</summary>

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=antontanderup&repository=mediocre-hass-media-player-cards&category=plugin)

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

### Mediocre Media Player Card

A standard-sized media player card for a single entity. Supports grouping, custom actions, and (optional) Music Assistant integration.

<img width="396" height="135" alt="Mediocre Media Player Card Screenshot" src="https://github.com/user-attachments/assets/443cbfb0-7cf9-4941-b909-360693266aab" />

→ [Read full documentation](./docs/mediocre-media-player-card.md)

---

### Mediocre Massive Media Player Card

A full-sized, feature-rich card for a single media player. Includes all features of the standard card, plus multiple display modes.

<img width="396" height="693" alt="Mediocre Massive Media Player Card Screenshot" src="https://github.com/user-attachments/assets/69afbcef-356a-460e-9779-2102f5747695" />

→ [Read full documentation](./docs/mediocre-massive-media-player-card.md)

---

### Mediocre Multi Media Player Card

Control and view multiple media players at once. Great for dashboards with several speakers or grouped devices.

<img width="396" height="779" alt="image" src="https://github.com/user-attachments/assets/ee38fc29-8516-404e-bd72-0781bb9696b4" />

→ [Read full documentation](./docs/mediocre-multi-media-player-card.md)

---

### Mediocre Chip Media Player Group Card

A compact chip-style card for quickly grouping/ungrouping speakers. Perfect for putting under your media player card of choice.

<img src="https://github.com/user-attachments/assets/96d2691c-e636-432a-87d9-f7dc33570ea6" width="400px" alt="Mediocre Chip Media Player Group Card Screenshot" />

→ [Read full documentation](./docs/mediocre-chip-media-player-group-card.md)

---

## More Features & Documentation

- [Universal Media Player integration](./docs/README_UMP.md)
- [Search functionality](./docs/README_SEARCH.md)
- [Custom Styles](./docs/README_STYLING.md)
- [Queue Management](./docs/README_QUEUE_MANAGEMENT.md)
- [LMS Features](./docs//README_LMS.md)
- [Music Assistant features](./docs/README_MA.md)

## Troubleshooting

If you run into issues:

1. Check that your entity supports the media player features needed
2. Verify your configuration syntax
3. Look for errors in your browser's developer console

## Thank You

Special thanks to the following projects and their authors for inspiration, ideas, or direct/indirect contributions:

- [mini-media-player](https://github.com/kalkih/mini-media-player)
- [bubble card](https://github.com/Clooos/Bubble-Card)
- [mushroom cards](https://github.com/piitaya/lovelace-mushroom)
- [hass-queue](https://github.com/droans/hass-queue)
- [lyrion-cli](https://github.com/peteS-UK/lyrion_cli)
- [music assistant](https://github.com/music-assistant/support)
- [lyrion music server](https://github.com/lms-community/slimserver)

Your work and creativity have helped make this project better!

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
