# Card Styling with CSS Variables

The Mediocre Media Player Card supports some customization through CSS variables.

## Available CSS Variables

### Dialog (modal) Colors

These variables control the appearance of dialog boxes and overlays:

- `--mmpc-dialog`: Background color for built in modal
- `--mmpc-on-dialog`: Primary text color
- `--mmpc-on-dialog-muted`: Secondary/muted text color
- `--mmpc-on-dialog-divider`: Divider color

### Card Colors

These variables control the appearance of the main card:

- `--mmpc-card`: Background color for the card
- `--mmpc-on-card`: Primary text color
- `--mmpc-on-card-muted`: Secondary/muted text color
- `--mmpc-on-card-divider`: Divider color

## Tips

- The card automatically falls back to standard Home Assistant theme variables if the custom variables are not defined
- Test your customizations in both light and dark modes if your theme supports both
