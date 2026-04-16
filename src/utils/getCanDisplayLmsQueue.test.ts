import { getCanDisplayLmsQueue } from "./getCanDisplayLmsQueue";

jest.mock("@utils", () => ({
  getHass: jest.fn(),
}));
const { getHass } = require("@utils");

describe("getCanDisplayLmsQueue", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns true when lyrion_cli service is present", () => {
    getHass.mockReturnValue({ services: { lyrion_cli: {} } });
    expect(getCanDisplayLmsQueue()).toBe(true);
  });

  it("returns false when lyrion_cli service is absent", () => {
    getHass.mockReturnValue({ services: {} });
    expect(getCanDisplayLmsQueue()).toBe(false);
  });
});
