import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isWatching = process.argv.includes("--watch");

  return {
    plugins: [preact()],
    build: {
      lib: {
        name: "MediocreMediaPlayerCard",
        entry: ["src/cards/index.ts"],
        fileName: () => `mediocre-hass-media-player-cards.js`,
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
      minify: process.env.NODE_ENV === "production" && !isWatching,
    },
    define: {
      "process.env": {},
    },
  };
});
