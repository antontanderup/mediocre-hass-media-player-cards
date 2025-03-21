import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      name: "MediocreMediaPlayerCard",
      entry: ["src/cards/index.ts"],
    },
  },
  define: {
    "process.env": {},
  },
});
