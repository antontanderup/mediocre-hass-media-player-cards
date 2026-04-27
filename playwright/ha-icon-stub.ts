/**
 * Generates a self-contained browser script that registers ha-icon and
 * ha-svg-icon custom elements backed by the full @mdi/js icon set.
 *
 * This file is intentionally test-only — it lives in playwright/ and is
 * never referenced by the Vite build entry point.
 */
import * as mdiAll from "@mdi/js";

// Convert an @mdi/js export name (e.g. "mdiSkipNext") to an HA icon name
// (e.g. "mdi:skip-next").  Handles camelCase, digits, and leading numbers.
function mdiKeyToHaName(key: string): string {
  return (
    "mdi:" +
    key
      .slice(3) // drop "mdi" prefix
      .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase word boundary
      .replace(/([a-zA-Z])([0-9])/g, "$1-$2") // letter → digit
      .replace(/([0-9])([A-Z])/g, "$1-$2") // digit → uppercase
      .toLowerCase()
  );
}

// Build the lookup map once at module import time.
const iconMap: Record<string, string> = {};
for (const [key, path] of Object.entries(mdiAll)) {
  if (typeof path === "string") {
    iconMap[mdiKeyToHaName(key)] = path;
  }
}

/**
 * Returns a browser-executable script (suitable for page.addScriptTag) that
 * defines ha-svg-icon and ha-icon as plain custom elements rendering real MDI
 * SVG paths.  Shadow DOM is intentionally avoided so that parent CSS custom
 * properties (--mdc-icon-size, --icon-primary-color, etc.) propagate normally.
 */
export function buildHaIconScript(): string {
  return `(function () {
  var MDI = ${JSON.stringify(iconMap)};

  // ha-svg-icon: renders a single SVG path, mirrors the real HA element's API.
  if (!customElements.get("ha-svg-icon")) {
    customElements.define("ha-svg-icon", class extends HTMLElement {
      static get observedAttributes() { return ["path", "viewbox"]; }
      connectedCallback() { this._sync(); }
      attributeChangedCallback() { this._sync(); }
      set path(v) { this._path = v; this._sync(); }
      get path() { return this._path || ""; }
      _sync() {
        var p = this._path || this.getAttribute("path") || "";
        var vb = this.getAttribute("viewbox") || "0 0 24 24";
        this.style.cssText =
          "display:inline-flex;align-items:center;justify-content:center;" +
          "width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);";
        this.innerHTML =
          '<svg viewBox="' + vb + '" ' +
          'style="display:block;width:100%;height:100%;fill:var(--icon-primary-color,currentColor)">' +
          '<path d="' + p + '"/></svg>';
      }
    });
  }

  // ha-icon: looks up the MDI path from the "icon" attribute and delegates to
  // an svg element directly (same visible result as the real Lit component).
  if (!customElements.get("ha-icon")) {
    customElements.define("ha-icon", class extends HTMLElement {
      static get observedAttributes() { return ["icon"]; }
      connectedCallback() { this._sync(); }
      attributeChangedCallback() { this._sync(); }
      _sync() {
        var icon = this.getAttribute("icon") || "";
        var p = MDI[icon] || "";
        this.style.cssText =
          "display:inline-flex;align-items:center;justify-content:center;" +
          "width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);";
        this.innerHTML =
          '<svg viewBox="0 0 24 24" ' +
          'style="display:block;width:100%;height:100%;fill:var(--icon-primary-color,currentColor)">' +
          '<path d="' + p + '"/></svg>';
      }
    });
  }
})();`;
}
