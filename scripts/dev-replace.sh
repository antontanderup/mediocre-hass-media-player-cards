#!/bin/bash

# Define colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Post-build string replacement for development mode${NC}"

# Path to the built file
BUILD_FILE="dist/mediocre-hass-media-player-cards.js"

# Check if the build file exists
if [ ! -f "$BUILD_FILE" ]; then
    echo "Build file not found: $BUILD_FILE"
    exit 1
fi

# Make a backup of the original file
cp "$BUILD_FILE" "$BUILD_FILE.bak"

# Perform replacements
echo -e "Replacing strings for development version...${NC}"
sed -i '' 's/mediocre-media-player-card/mediocre-media-player-card-test/g' "$BUILD_FILE"
sed -i '' 's/mediocre-massive-media-player-card/mediocre-massive-media-player-card-test/g' "$BUILD_FILE"
sed -i '' 's/mediocre-chip-media-player-group-card/mediocre-chip-media-player-group-card-test/g' "$BUILD_FILE"

echo -e "${GREEN}Replacement complete! Development version ready.${NC}"

# Keep watching for changes to the build file
echo -e "${BLUE}Watching for changes to the build file...${NC}"
while true; do
  if [ -f "$BUILD_FILE" ] && [ "$BUILD_FILE" -nt "$BUILD_FILE.bak" ]; then
    echo -e "Build file updated, replacing strings...${NC}"
    cp "$BUILD_FILE" "$BUILD_FILE.bak"
    sed -i '' 's/mediocre-media-player-card/mediocre-media-player-card-test/g' "$BUILD_FILE"
    sed -i '' 's/mediocre-massive-media-player-card/mediocre-massive-media-player-card-test/g' "$BUILD_FILE"
    sed -i '' 's/mediocre-chip-media-player-group-card/mediocre-chip-media-player-group-card-test/g' "$BUILD_FILE"
    echo -e "${GREEN}Replacement complete!${NC}"
  fi
  sleep 2
done
