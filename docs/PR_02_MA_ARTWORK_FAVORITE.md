# PR 2: Music Assistant Artwork Favorite

This document summarizes the second review-sized PR branch:

- branch: `pr/02-ma-artwork-favorite`
- base: `pr/01-view-and-footer-options`

## Goal

Keep this PR focused on one coherent Music Assistant feature:

- add a configurable MA favorite control on the large player artwork
- make that control work in both directions when MA exposes enough queue/library information
- keep the editor/config shape small and MA-specific

This PR intentionally does **not** include:

- favorite controls in the large volume row
- grouped volume work
- MA Search / Library redesign
- extra generic UI customization work

## Why

The card already supported `ma_favorite_button_entity_id`, but that was only a one-way action hidden behind extra actions.

That left three gaps:

- no visible favorite state on the main player surface
- no clear way to remove a favorite from the same surface
- no editor support for configuring the artwork placement/appearance

This PR turns that into a real artwork control while staying inside the boundaries that Music Assistant and the Home Assistant integration currently expose.

## What changed

### New config block: `ma_favorite_control`

Supported fields in this PR:

- `show_on_artwork`
  - enables the artwork overlay button
- `favorite_button_size`
  - `small | medium | large`
- `favorite_button_offset`
  - one CSS offset value or two values as `x y`
- `active_color`
  - icon color when the current item is favorited
- `inactive_color`
  - icon color when the current item is not favorited

Example:

```yaml
ma_favorite_control:
  show_on_artwork: true
  favorite_button_size: medium
  favorite_button_offset: 14px
  active_color: "#f2c94c"
  inactive_color: "#111111"
```

Offset behavior:

- one value: applies to both axes
- two values: `x y`
- `x` is distance from the right edge
- `y` is distance from the top edge

Examples:

```yaml
favorite_button_offset: 14px
```

```yaml
favorite_button_offset: 24px 14px
```

### Editor support

The favorite control is configured inside the existing Music Assistant section, not under generic UI options.

That means:

- single card editor: under `Music Assistant Integration (optional)`
- massive card editor: under `Music Assistant Integration (optional)`
- multi card editor: per-player under `Music Assistant Integration (optional)`

The artwork-specific controls only appear where there is actually a large artwork surface to place them on.

In practice:

- regular card: available when the card uses popup artwork
- massive card: available directly
- multi card: available for large cards

The controls were kept in the MA section on purpose because this is not generic footer/UI customization. It depends on:

- `ma_entity_id`
- `ma_favorite_button_entity_id`
- MA queue behavior

### New runtime pieces

This PR adds a dedicated runtime path for the artwork control:

- `MaFavoriteButton`
- `useMaFavoriteControl`

Why:

- keep the favorite logic isolated from the rest of the artwork/player rendering
- keep MA-specific edge cases in one place
- avoid leaking this behavior into unrelated generic button code

## How the two-way favorite behavior works

The working implementation ended up being:

- read favorite state from `music_assistant.get_queue`
- add favorite by pressing the HA-created MA favorite button entity
- remove favorite via `mass_queue.unfavorite_current_item`

In practice that means:

### Add favorite

The Home Assistant Music Assistant integration creates a dedicated button entity for "favorite current song".

This PR uses:

- `button.press`
- target: `ma_favorite_button_entity_id`

Reference:

- Home Assistant Music Assistant integration: `Favorite current song button`
  - https://www.home-assistant.io/integrations/music_assistant/

### Remove favorite

For removal, this PR uses the MA queue action:

```yaml
action: mass_queue.unfavorite_current_item
data:
  entity: media_player.my_ma_player
```

This is what makes the control genuinely two-way for tracks that Music Assistant is exposing as library-backed queue items.

### State / refresh behavior

The card reads the current favorite state from:

- `music_assistant.get_queue`

and then keeps a very small local override layer so that:

- clicking the button responds immediately
- Home Assistant Developer Tools actions show up immediately on open dashboards
- the visual state settles back to the real queue state once MA/HA reports it

This ended up being the most reliable compromise without introducing a large custom state machine.

The final behavior is intentionally modest:

- local click sets a short-lived rendered override
- Home Assistant `call_service` events for favorite/unfavorite also update that rendered override
- the queue-reported state remains the long-term source of truth
- a lightweight background refresh remains enabled so multiple open dashboards can converge even when they are otherwise idle

This was the simplest model that still behaved well in testing across:

- local clicks
- two browser windows
- Developer Tools manual service calls

## Important limitation: provider items vs library items

This PR needs to be explicit about a current Music Assistant limitation.

Music Assistant favorites are library-backed.

That means there is an important difference between:

- `library://track/...`
- provider URIs such as `spotify--...://track/...`

### Library items

If the current queue item is already a library item:

- favorite works
- unfavorite works
- the control behaves like a real toggle

### Non-library/provider items

If the current queue item is still a provider item:

- favoriting is allowed
- unfavoriting is **not** allowed yet from this control

Why:

- Music Assistant favorites are a subset of the library
- favoriting a non-library item first adds it to the MA library
- that can require metadata work before the track becomes a stable library-backed item

This is why some tracks may initially appear with provider URIs like:

```text
spotify--...://track/...
```

and only later show up as:

```text
library://track/...
```

Once the current item is library-backed, unfavorite becomes available.

### User-facing behavior in this PR

For provider items:

- clicking the control when not favorited still sends the favorite action
- the card shows:
  - `For non-library items, favoriting may take a few minutes to appear.`
- if the user tries to unfavorite a non-library item, the card shows:
  - `Unfavorite is only available for library tracks.`

This avoids broken backend errors in the UI and matches the current MA behavior more honestly.

## User-facing behavior summary

### When the current item is a library track

- the star reflects current favorite state
- clicking it favorites or unfavorites immediately
- the state should sync quickly across open dashboards

### When the current item is a provider-backed track

- the star can still be used to favorite the track
- the card warns that the favorite may take time to appear
- unfavorite is intentionally blocked until MA exposes the track as a library item

### When MA favorite config is missing

If any of the required MA pieces are missing:

- no artwork favorite button is shown

That means the feature remains fully opt-in.

## Related MA discussion / docs

Useful references for this behavior:

- Home Assistant Music Assistant integration
  - https://www.home-assistant.io/integrations/music_assistant/
- Music Assistant discussion about favorite services / current-item favorite workflows
  - https://github.com/orgs/music-assistant/discussions/1984
- Music Assistant Spotify provider docs
  - https://www.music-assistant.io/music-providers/spotify/

The relevant MA behavior here is that favoriting a provider-backed item effectively turns into "add to library + favorite", which is why non-library items may not reflect instantly.

## Example

```yaml
type: custom:mediocre-massive-media-player-card
entity_id: media_player.ma_basement_sonos
mode: card
ma_entity_id: media_player.ma_basement_sonos
ma_favorite_button_entity_id: button.ma_basement_favorite_current_song
ma_favorite_control:
  show_on_artwork: true
  favorite_button_size: medium
  favorite_button_offset: 14px
  active_color: "#f2c94c"
  inactive_color: "#111111"
```

For multi card usage:

```yaml
type: custom:mediocre-multi-media-player-card
entity_id: media_player.ma_basement_sonos
size: large
mode: card
media_players:
  - entity_id: media_player.ma_basement_sonos
    ma_entity_id: media_player.ma_basement_sonos
    ma_favorite_button_entity_id: button.ma_basement_favorite_current_song
    ma_favorite_control:
      show_on_artwork: true
      favorite_button_size: medium
      favorite_button_offset: 24px 14px
```

## Screenshots

Suggested screenshots to include in the PR:

- editor screenshot showing the Music Assistant configuration section and artwork favorite controls
- runtime screenshot showing the favorite button on artwork

Those two images should make the PR much easier to scan quickly.

## Compatibility

This PR is additive and intentionally narrow.

- existing cards do not need YAML changes
- existing `ma_favorite_button_entity_id` behavior still works
- if `ma_favorite_control` is omitted, nothing new is shown
- the config is kept MA-specific rather than adding another generic UI customization layer

## Scope

Included here:

- artwork favorite button
- MA-specific config/editor support
- two-way behavior for library-backed items
- graceful provider-item handling

Still out of scope:

- favorite button on the volume row
- grouped volume panel
- larger MA Search / Library changes

## Files changed

Runtime/UI:

- [AlbumArt.tsx](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/components/AlbumArt/AlbumArt.tsx)
- [MassivePlaybackController.tsx](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/components/MassivePlaybackController/MassivePlaybackController.tsx)
- [MaFavoriteButton.tsx](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/components/MaFavoriteButton/MaFavoriteButton.tsx)
- [useMaFavoriteControl.ts](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/hooks/useMaFavoriteControl.ts)

Editor/config plumbing:

- [FieldGroupMaEntities.tsx](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/components/Form/components/FieldGroupMaEntities.tsx)
- [MediocreMassiveMediaPlayerCardEditor.tsx](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/components/MediocreMassiveMediaPlayerCard/MediocreMassiveMediaPlayerCardEditor.tsx)
- [MediocreMediaPlayerCardEditor.tsx](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/components/MediocreMediaPlayerCard/MediocreMediaPlayerCardEditor.tsx)
- [MediocreMultiMediaPlayerCardEditor.tsx](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/components/MediocreMultiMediaPlayerCard/MediocreMultiMediaPlayerCardEditor.tsx)
- [config.ts](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/types/config.ts)
- [cardConfigUtils.ts](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/utils/cardConfigUtils.ts)
- [getMediocreLegacyConfigToMultiConfig.ts](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/utils/getMediocreLegacyConfigToMultiConfig.ts)
- [getMediocreMassiveLegacyConfigToMultiConfig.ts](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/utils/getMediocreMassiveLegacyConfigToMultiConfig.ts)
- [getMultiConfigToMediocreMassiveConfig.ts](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/utils/getMultiConfigToMediocreMassiveConfig.ts)
- [index.ts](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/components/index.ts)
- [index.ts](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/hooks/index.ts)

Tests:

- [maFavoriteArtwork.config.test.ts](/g:/Documents/Code%202025/repos/mediocre-hass-media-player-cards/src/utils/maFavoriteArtwork.config.test.ts)

## Validation

Validated on this branch with:

- `yarn tsc --noEmit`
- `yarn test`
- `yarn build`

I also generated a `.gz` build artifact locally for Home Assistant testing.
