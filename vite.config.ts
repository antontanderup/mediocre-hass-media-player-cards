import { defineConfig } from "vite";
import { preact } from "@preact/preset-vite";
import path from "path";

// https://vitejs.dev/config/
// eslint-disable-next-line no-empty-pattern
export default defineConfig(({}) => {
  const isWatching = process.argv.includes("--watch");
  const isDevelopment =
    process.argv.includes("--mode") && process.argv.includes("development");

  return {
    plugins: [preact()],
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@wrappers": path.resolve(__dirname, "./src/wrappers"),
      },
    },
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
      "process.env": {},
    },
  };
});
