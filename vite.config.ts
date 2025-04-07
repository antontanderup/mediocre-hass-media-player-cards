import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig(({}) => {
  const isWatching = process.argv.includes("--watch");
  const isDevelopment =
    process.argv.includes("--mode") && process.argv.includes("development");

  return {
    plugins: [preact()],
    build: {
      lib: {
        name: "MediocreMediaPlayerCard",
        entry: ["src/cards/index.ts"],
        fileName: () =>
          `mediocre-hass-media-player-cards${isDevelopment ? "-dev" : ""}.js`,
        formats: ["umd"],
      },
      // Only include watch configuration if --watch flag is present
      ...(isWatching
        ? {
            watch: {
              include: "src/**",
            },
          }
        : {}),
      // Ensure we don't get minification in watch mode for easier debugging
      minify: !isDevelopment,
    },
    define: {
      "process.env": {
        VITE_MEDIA_PLAYER_CARD: JSON.stringify(
          process.env.VITE_MEDIA_PLAYER_CARD || "mediocre-media-player-card"
        ),
        VITE_MEDIA_PLAYER_CARD_EDITOR: JSON.stringify(
          process.env.VITE_MEDIA_PLAYER_CARD_EDITOR ||
            "mediocre-media-player-card-editor"
        ),
        VITE_MASSIVE_MEDIA_PLAYER_CARD: JSON.stringify(
          process.env.VITE_MASSIVE_MEDIA_PLAYER_CARD ||
            "mediocre-massive-media-player-card"
        ),
        VITE_MASSIVE_MEDIA_PLAYER_CARD_EDITOR: JSON.stringify(
          process.env.VITE_MASSIVE_MEDIA_PLAYER_CARD_EDITOR ||
            "mediocre-massive-media-player-card-editor"
        ),
        VITE_CHIP_MEDIA_PLAYER_GROUP_CARD: JSON.stringify(
          process.env.VITE_CHIP_MEDIA_PLAYER_GROUP_CARD ||
            "mediocre-chip-media-player-group-card"
        ),
      },
    },
  };
});
