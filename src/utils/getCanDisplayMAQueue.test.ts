import { getCanDisplayMAQueue } from "./getCanDisplayMAQueue";

jest.mock("@utils", () => ({
  getHass: jest.fn(),
}));
const { getHass } = require("@utils");

describe("getCanDisplayMAQueue", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns true when mass_queue service is present", () => {
    getHass.mockReturnValue({ services: { mass_queue: {} } });
    expect(getCanDisplayMAQueue()).toBe(true);
  });

  it("returns false when mass_queue service is absent", () => {
    getHass.mockReturnValue({ services: {} });
    expect(getCanDisplayMAQueue()).toBe(false);
  });
});
