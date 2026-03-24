# Release Notes — v0.30.0

## 🚀 Highlights

- **Multi Card — Compact Mode — NEW!**
  - The Multi card now supports a `size: compact` mode that renders a single compact card (visually similar to the standard Mediocre Media Player Card) showing the currently active player.
  - Supports the same options as the standard card: `tap_opens_popup`, `hide_when_off`, `hide_when_group_child`, `always_show_power_button`, and `always_show_custom_buttons`.

- **Multi Card — Default Tab Setting — NEW!**
  - `size: large` now supports a `options.default_tab` setting, letting you choose which tab opens by default (`massive`, `search`, `media-browser`, `speaker-grouping`, `custom-buttons`, or `queue`).

- **Experimental LMS Media Browser — NEW!**
  - Enable `options.use_experimental_lms_media_browser: true` (requires `lms_entity_id` and the lyrion_cli integration) to replace the built-in media browser with a purpose-built lyrion_cli-based browser.
  - Features **global search** across your entire LMS library and **app access** for LMS plugins such as Spotty (Spotify) and Qobuz.
  - Available on the standard, massive, and multi cards.

- **New Volume Slider**
  - Redesigned volume slider with relative drag and tap-to-increment/decrement support for more precise and intuitive control.
  - Additional UI polish

- **Clear Queue — NEW!**
  - Added a clear queue action, letting you wipe the current playback queue directly from the card.

- **Bug Fixes & Improvements**
  - Fixed crash caused by unexpected color variable values in artwork color extraction.
  - Fixed speaker group config not being properly converted when migrating from regular card configs to multi card configs.
  - Fixed stale data blink when browsing media.
  - Fixed error when triggering playback in the experimental LMS media browser.
  - Fixed a cache issue caused by Home Assistant mutating internal message promise objects.
  - Various context handling improvements and small UI tweaks throughout.
  - Added stable IDs to compact card buttons to improve integration with automations and browser tooling.
  - Hooks linter rules added internally; several latent bugs caught and fixed as a result.

## 📖 Documentation

- [Multi Card](./mediocre-multi-media-player-card.md) — updated with compact mode and new options
- [LMS Features](./README_LMS.md) — updated with experimental media browser documentation

## 👏 Contributors

- [@antontanderup](https://github.com/antontanderup) — all features and fixes in this release
- Everyone who reported bugs and provided feedback — your input directly shaped this release. Thank you!

---

**Full Changelog**: https://github.com/antontanderup/mediocre-hass-media-player-cards/compare/v0.29.2...v0.30.0
