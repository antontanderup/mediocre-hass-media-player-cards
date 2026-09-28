## Summary

This PR adds a configurable `Linked Volume Panel` to the large multi-player card.

It is aimed at setups where one selected player is logically tied to one or more
other volume-controlled endpoints, for example:

- a Sonos player that also feeds an AVR
- a player plus one or more zones with their own volume controls
- a player that sometimes participates in a runtime speaker group

The feature is intentionally config-first.

It introduces:

- a per-player `linked_volume_panel` config block
- a new `Volume Panel` view in the large multi-player card
- a per-player launch setting for opening that panel from the trailing volume-bar button
- optional inclusion of grouped players at runtime
- a UI customization override for the trailing volume button icon

This PR is intentionally limited to the large multi-player card. It does not add
single-card or massive-card support.

## Why

The previous idea for this area was too split across unrelated settings.

In practice, the linked/grouped volume feature needs to answer three separate
questions together:

- which endpoints should appear in the panel
- whether grouped players should also be included at runtime
- how the user opens the panel

Putting launch behavior in generic `options` while the actual linked entities
lived under the player config made the model harder to understand.

This PR moves the activation point into the per-player panel config itself, so
the feature can be read as one coherent block.

## Config

### Per-player: `linked_volume_panel`

Supported fields:

- `launch_from`
  - `disabled | trailing_volume_bar_button`
- `include_grouped_players`
  - `true | false`
- `entities`
  - ordered list of linked media-player rows

Each entity row supports:

- `entity_id`
- `name`
- `icon`
- `show_power`

Important rule:

- if you want the selected player itself to appear in the panel, add it
  explicitly to `entities`

That rule keeps the feature predictable. The panel shows explicitly configured
rows first, and only then optionally appends grouped players.

### UI customization

The launch icon override stays in UI customization:

```yaml
options:
  ui:
    volume_bar:
      trailing_volume_button_icon: mdi:volume-source
```

This is only an icon override. The feature activation itself lives in
`linked_volume_panel`.

## Example

### Explicit linked endpoints only

```yaml
type: custom:mediocre-multi-media-player-card
entity_id: media_player.ma_basement_sonos
size: large
mode: card
media_players:
  - entity_id: media_player.ma_basement_sonos
    linked_volume_panel:
      launch_from: trailing_volume_bar_button
      entities:
        - entity_id: media_player.ma_basement_sonos
          name: MA Basement Sonos
        - entity_id: media_player.family_pioneer
          name: Family Pioneer
          show_power: true
```

### Explicit endpoints plus grouped players

```yaml
type: custom:mediocre-multi-media-player-card
entity_id: media_player.ma_basement_sonos
size: large
mode: card
options:
  ui:
    volume_bar:
      trailing_volume_button_icon: mdi:volume-source
media_players:
  - entity_id: media_player.ma_basement_sonos
    linked_volume_panel:
      launch_from: trailing_volume_bar_button
      include_grouped_players: true
      entities:
        - entity_id: media_player.ma_basement_sonos
          name: MA Basement Sonos
        - entity_id: media_player.family_pioneer
          name: Family Pioneer
          show_power: true
  - entity_id: media_player.ma_dining_sonos
    linked_volume_panel:
      entities:
        - entity_id: media_player.ma_dining_sonos
          name: MA Dining Sonos
```

In that case:

- the selected player's configured rows appear first
- if the selected player is grouped with other configured players, each grouped
  player gets its own section
- grouped-player sections include that player's own row by default, plus any
  linked rows explicitly configured for that grouped player

## Editor support

This PR adds editor support for the large multi-player card.

Per player:

- `Linked Volume Panel (optional)`
  - `Launch Panel from`
  - `Include Grouped Players`
  - `Volume Panel Entities`

UI customization:

- `UI Customization (optional)`
  - `Volume Bar`
    - `Trailing volume button icon`

This matches the runtime model much more closely than the earlier split
between panel setup and generic advanced options.

## Runtime behavior

### Launch behavior

The trailing volume-bar button behaves per selected player:

- if `launch_from` is `trailing_volume_bar_button` and the selected player has
  a usable linked volume panel, the trailing button opens the panel
- otherwise the trailing button remains the normal power button

### Panel structure

The panel view is rendered as sections by player.

For example:

- section: `MA Basement Sonos`
  - `MA Basement Sonos`
  - `Family Pioneer`
- section: `MA Dining Sonos`
  - `MA Dining Sonos`

This makes grouped/runtime additions much easier to read than a flat list.

### Row behavior

Each row is a media-player row:

- volume acts on that row's `entity_id`
- mute acts on that row's `entity_id`
- optional power acts on that row's `entity_id`

There is no separate `power_entity_id` in this design.

### Close behavior

The `Volume Panel` header includes a close icon that returns to the main player
view.

## Scope

Included here:

- large multi-card linked volume panel
- per-player launch activation
- grouped-player inclusion
- ordered linked entity rows
- optional per-row power button
- trailing volume button icon override
- editor support

Intentionally not included:

- single-card support
- massive-card support
- custom trailing button launch targets
- favorite/custom trailing modes
- legacy compatibility layers for older grouped-volume config ideas

## Compatibility

This PR is additive.

- existing configs do not need changes
- if `linked_volume_panel` is omitted, nothing new appears
- if `launch_from` is omitted or `disabled`, the trailing volume button remains
  the normal power button

## Validation

Validated locally with:

- `yarn tsc --noEmit`
- `yarn test`
- `yarn build`

Artifacts generated:

- `dist/mediocre-hass-media-player-cards.js`
- `dist/mediocre-hass-media-player-cards.js.gz`

## Suggested screenshots

- editor screenshot showing `Linked Volume Panel (optional)`
- runtime screenshot showing `Volume Panel` sectioned by player

## Note on stacking

This PR is intended to be reviewed on top of `pr/02-ma-artwork-favorite`.
