import { test, Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { mockHass } from "./mock-hass";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BUNDLE_PATH = path.resolve(
  __dirname,
  "../dist/mediocre-hass-media-player-cards-dev.js"
);
const SCREENSHOTS_DIR = path.resolve(__dirname, "../screenshots");

// Dark HA-style CSS variables applied to every page.
const HA_DARK_CSS = `
  :root {
    --card-background-color: #1e1e2e;
    --ha-card-background: #1e1e2e;
    --primary-text-color: #cdd6f4;
    --secondary-text-color: #a6adc8;
    --primary-color: #89b4fa;
    --ha-card-border-radius: 12px;
    --divider-color: rgba(205, 214, 244, 0.12);
    --secondary-background-color: #181825;
    --ha-dialog-surface-background: #313244;
    --mdc-theme-surface: #313244;
    --icon-primary-color: #cdd6f4;
    --paper-item-icon-color: #cdd6f4;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 20px;
    background: #11111b;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: var(--primary-text-color);
  }
`;

// Minimal stubs for HA custom elements that the cards reference.
const HA_ELEMENT_STUBS = `
  // ha-card: styled card container
  customElements.define("ha-card", class extends HTMLElement {
    connectedCallback() {
      this.style.display = "block";
      this.style.background = "var(--ha-card-background, var(--card-background-color, #1e1e2e))";
      this.style.borderRadius = "var(--ha-card-border-radius, 12px)";
      this.style.boxShadow = "0 2px 12px rgba(0,0,0,0.4)";
      this.style.overflow = "hidden";
    }
  });

  // ha-icon: renders a filled circle using currentColor as placeholder.
  customElements.define("ha-icon", class extends HTMLElement {
    static get observedAttributes() { return ["icon"]; }
    connectedCallback() { this._render(); }
    attributeChangedCallback() { this._render(); }
    _render() {
      this.style.display = "inline-flex";
      this.style.alignItems = "center";
      this.style.justifyContent = "center";
      this.style.width = "var(--mdc-icon-size, 24px)";
      this.style.height = "var(--mdc-icon-size, 24px)";
      this.style.flexShrink = "0";
      this.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" style="display:block"><circle cx="12" cy="12" r="9" fill-opacity="0.25"/><circle cx="12" cy="12" r="6" fill-opacity="0.55"/><circle cx="12" cy="12" r="3"/></svg>';
    }
  });

  // ha-slider: thin range input wrapper
  customElements.define("ha-slider", class extends HTMLInputElement {}, { extends: "input" });
`;

/** Set up a fresh browser page with HA theme CSS and element stubs, then inject the card bundle. */
async function setupPage(page: Page) {
  await page.setContent(`<!DOCTYPE html><html><head><style>${HA_DARK_CSS}</style></head><body></body></html>`);

  // Define stub HA custom elements before the bundle registers card elements.
  await page.addScriptTag({ content: HA_ELEMENT_STUBS });

  // Mount <home-assistant> BEFORE the bundle loads.
  // getHass() = document.querySelector("home-assistant").hass is called during
  // bundle initialisation, so the element must already exist.
  await page.evaluate((hassData) => {
    function buildHass(data: Record<string, unknown>) {
      return {
        ...data,
        hassUrl: (p: string) =>
          p.startsWith("data:") || p.startsWith("http") ? p : `http://localhost:8123${p}`,
        callService: () => Promise.resolve(),
        callWS: () => Promise.resolve(),
        subscribeEvents: () => () => {},
        subscribeMessage: () => () => {},
        connection: { subscribeEvents: () => () => {}, addEventListener: () => {} },
        localize: (key: string) => key,
        formatEntityState: () => "",
        formatEntityAttributeValue: (_: unknown, __: unknown, val: unknown) =>
          String(val ?? ""),
        formatEntityAttributeName: (_: unknown, attr: string) => attr,
        services: { lyrion_cli: undefined, mass_queue: undefined },
      };
    }

    const haEl = document.createElement("home-assistant");
    const hass = buildHass(hassData as Record<string, unknown>);
    (haEl as unknown as Record<string, unknown>)["hass"] = hass;
    document.body.insertBefore(haEl, document.body.firstChild);
    (window as unknown as Record<string, unknown>)["__mockHass"] = hass;
  }, mockHass);

  // Inject the built bundle (now getHass() will find the element above).
  const bundle = fs.readFileSync(BUNDLE_PATH, "utf-8");
  await page.addScriptTag({ content: bundle });
}

/** Create a card element, configure it, and trigger a render by setting hass. */
async function mountCard(
  page: Page,
  tagName: string,
  config: Record<string, unknown>,
  containerStyle = ""
) {
  await page.evaluate(
    ({ tag, cfg, style }) => {
      const container = document.createElement("div");
      if (style) container.setAttribute("style", style);
      document.body.appendChild(container);

      const card = document.createElement(tag) as HTMLElement & {
        setConfig: (c: unknown) => void;
        hass: unknown;
      };
      card.setConfig(cfg);
      card.hass = (window as unknown as Record<string, unknown>)["__mockHass"];
      container.appendChild(card);
    },
    { tag: tagName, cfg: config, style: containerStyle }
  );
}

/** Wait long enough for Preact effects, image loads, and Vibrant palette extraction. */
async function waitForRender(page: Page, ms = 1800) {
  await page.waitForTimeout(ms);
}

// ---------------------------------------------------------------------------
// Screenshot helper
// ---------------------------------------------------------------------------

async function takeScreenshot(page: Page, filename: string) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  const screenshotPath = path.join(SCREENSHOTS_DIR, filename);

  // Screenshot the first card element on the page for a tight crop.
  const cardEl =
    (await page.$("mediocre-media-player-card")) ??
    (await page.$("mediocre-massive-media-player-card")) ??
    (await page.$("mediocre-multi-media-player-card")) ??
    (await page.$("mediocre-chip-media-player-group-card"));

  if (cardEl) {
    await cardEl.screenshot({ path: screenshotPath });
  } else {
    // Fallback: screenshot the body wrapper
    const wrapper = await page.$("body > div");
    if (wrapper) await wrapper.screenshot({ path: screenshotPath });
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test("mediocre-media-player-card screenshot", async ({ page }) => {
  await setupPage(page);
  await mountCard(
    page,
    "mediocre-media-player-card",
    {
      type: "mediocre-media-player-card",
      entity_id: "media_player.living_room",
      speaker_group: {
        entities: [
          { entity: "media_player.kitchen" },
          { entity: "media_player.bedroom" },
          { entity: "media_player.office" },
        ],
      },
    },
    "width:420px"
  );
  await waitForRender(page);
  await takeScreenshot(page, "mediocre-media-player-card.png");
});

test("mediocre-massive-media-player-card screenshot", async ({ page }) => {
  await setupPage(page);
  await mountCard(
    page,
    "mediocre-massive-media-player-card",
    {
      type: "mediocre-massive-media-player-card",
      entity_id: "media_player.living_room",
      mode: "card",
      speaker_group: {
        entities: [
          { entity: "media_player.kitchen" },
          { entity: "media_player.bedroom" },
          { entity: "media_player.office" },
        ],
      },
    },
    "width:420px"
  );
  await waitForRender(page);
  await takeScreenshot(page, "mediocre-massive-media-player-card.png");
});

test("mediocre-multi-media-player-card screenshot", async ({ page }) => {
  await setupPage(page);
  await mountCard(
    page,
    "mediocre-multi-media-player-card",
    {
      type: "mediocre-multi-media-player-card",
      entity_id: "media_player.living_room",
      size: "large",
      mode: "card",
      media_players: [
        { entity_id: "media_player.living_room" },
        { entity_id: "media_player.kitchen" },
        { entity_id: "media_player.bedroom" },
        { entity_id: "media_player.office" },
      ],
    },
    "width:420px"
  );
  await waitForRender(page);
  await takeScreenshot(page, "mediocre-multi-media-player-card.png");
});

test("mediocre-chip-media-player-group-card screenshot", async ({ page }) => {
  await setupPage(page);
  await mountCard(
    page,
    "mediocre-chip-media-player-group-card",
    {
      type: "mediocre-chip-media-player-group-card",
      entity_id: "media_player.living_room",
      entities: [
        { entity: "media_player.kitchen" },
        { entity: "media_player.bedroom" },
        { entity: "media_player.office" },
      ],
    },
    "width:420px"
  );
  await waitForRender(page);
  await takeScreenshot(page, "mediocre-chip-media-player-group-card.png");
});
