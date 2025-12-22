/**
 * @jest-environment jsdom
 */

import { isDarkMode } from "./getIsDarkMode";

// Mock getHass
jest.mock("./getHass", () => ({
  getHass: jest.fn(),
}));

const { getHass } = require("./getHass");

describe("isDarkMode", () => {
  let originalMatchMedia: any;
  let originalGetComputedStyle: any;

  beforeAll(() => {
    originalMatchMedia = window.matchMedia;
    originalGetComputedStyle = window.getComputedStyle;
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
    window.getComputedStyle = originalGetComputedStyle;
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns true if selectedTheme.dark is true", () => {
    getHass.mockReturnValue({ selectedTheme: { dark: true } });
    expect(isDarkMode()).toBe(true);
  });

  it("returns false if selectedTheme.dark is false", () => {
    getHass.mockReturnValue({ selectedTheme: { dark: false } });
    expect(isDarkMode()).toBe(false);
  });

  it("parses hex --primary-text-color as bright (dark mode)", () => {
    getHass.mockReturnValue({ selectedTheme: { dark: undefined } });
    document.documentElement.style.setProperty("--primary-text-color", "#fff");
    window.getComputedStyle = () =>
      ({
        getPropertyValue: (name: string) =>
          name === "--primary-text-color" ? "#fff" : "",
      }) as any;
    expect(isDarkMode()).toBe(true);
  });

  it("parses hex --primary-text-color as dark (light mode)", () => {
    getHass.mockReturnValue({ selectedTheme: { dark: undefined } });
    document.documentElement.style.setProperty("--primary-text-color", "#111");
    window.getComputedStyle = () =>
      ({
        getPropertyValue: (name: string) =>
          name === "--primary-text-color" ? "#111" : "",
      }) as any;
    expect(isDarkMode()).toBe(false);
  });

  it("parses rgb --primary-text-color as bright (dark mode)", () => {
    getHass.mockReturnValue({ selectedTheme: { dark: undefined } });
    document.documentElement.style.setProperty(
      "--primary-text-color",
      "rgb(255,255,255)"
    );
    window.getComputedStyle = () =>
      ({
        getPropertyValue: (name: string) =>
          name === "--primary-text-color" ? "rgb(255,255,255)" : "",
      }) as any;
    expect(isDarkMode()).toBe(true);
  });

  it("parses rgb --primary-text-color as dark (light mode)", () => {
    getHass.mockReturnValue({ selectedTheme: { dark: undefined } });
    document.documentElement.style.setProperty(
      "--primary-text-color",
      "rgb(10,10,10)"
    );
    window.getComputedStyle = () =>
      ({
        getPropertyValue: (name: string) =>
          name === "--primary-text-color" ? "rgb(10,10,10)" : "",
      }) as any;
    expect(isDarkMode()).toBe(false);
  });

  it("falls back to matchMedia if no theme or color", () => {
    getHass.mockReturnValue({ selectedTheme: { dark: undefined } });
    window.getComputedStyle = () =>
      ({
        getPropertyValue: () => "",
      }) as any;
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
    expect(isDarkMode()).toBe(true);
    window.matchMedia = jest.fn().mockReturnValue({ matches: false });
    expect(isDarkMode()).toBe(false);
  });
});
