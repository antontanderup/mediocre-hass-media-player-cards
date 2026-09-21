import {
  computeTrackPosition,
  formatTrackTime,
  TrackPlayerInput,
} from "./computeTrackPosition";

describe("computeTrackPosition", () => {
  const baseTime = new Date("2026-09-10T12:00:00Z");

  it("returns null when media_position is missing or negative", () => {
    expect(
      computeTrackPosition({
        state: "playing",
        attributes: { media_duration: 180 },
      })
    ).toBeNull();

    expect(
      computeTrackPosition({
        state: "playing",
        attributes: { media_position: -1, media_duration: 180 },
      })
    ).toBeNull();
  });

  it("returns null when media_duration is missing or <= 0", () => {
    expect(
      computeTrackPosition({
        state: "playing",
        attributes: { media_position: 10 },
      })
    ).toBeNull();

    expect(
      computeTrackPosition({
        state: "playing",
        attributes: { media_position: 10, media_duration: 0 },
      })
    ).toBeNull();

    expect(
      computeTrackPosition({
        state: "playing",
        attributes: { media_position: 10, media_duration: -5 },
      })
    ).toBeNull();
  });

  it("calculates elapsed position when playing with media_position_updated_at", () => {
    const updatedAt = new Date("2026-09-10T12:00:00Z").toISOString();
    const now = new Date("2026-09-10T12:00:30Z"); // 30 seconds later

    const player: TrackPlayerInput = {
      state: "playing",
      attributes: {
        media_position: 15,
        media_position_updated_at: updatedAt,
        media_duration: 180,
      },
    };

    const result = computeTrackPosition(player, now);
    expect(result).not.toBeNull();
    expect(result?.currentPosition).toBe(45);
    expect(result?.prettyNow).toBe("00:45");
    expect(result?.prettyEnd).toBe("03:00");
  });

  it("does not add elapsed time when paused", () => {
    // 10 minutes (600s) have passed since updated_at
    const updatedAt = new Date("2026-09-10T12:00:00Z").toISOString();
    const now = new Date("2026-09-10T12:10:00Z");

    const player: TrackPlayerInput = {
      state: "paused",
      attributes: {
        media_position: 60,
        media_position_updated_at: updatedAt,
        media_duration: 180,
      },
    };

    const result = computeTrackPosition(player, now);
    expect(result).not.toBeNull();
    // Position should NOT have elapsed to 660s; it should remain 60s
    expect(result?.currentPosition).toBe(60);
    expect(result?.prettyNow).toBe("01:00");
    expect(result?.prettyEnd).toBe("03:00");
  });

  it("does not add elapsed time when buffering or idle", () => {
    const updatedAt = new Date("2026-09-10T12:00:00Z").toISOString();
    const now = new Date("2026-09-10T12:05:00Z");

    const playerBuffering: TrackPlayerInput = {
      state: "buffering",
      attributes: {
        media_position: 40,
        media_position_updated_at: updatedAt,
        media_duration: 200,
      },
    };

    expect(computeTrackPosition(playerBuffering, now)?.currentPosition).toBe(
      40
    );

    const playerIdle: TrackPlayerInput = {
      state: "idle",
      attributes: {
        media_position: 0,
        media_position_updated_at: updatedAt,
        media_duration: 200,
      },
    };

    expect(computeTrackPosition(playerIdle, now)?.currentPosition).toBe(0);
  });

  it("works when paused even if media_position_updated_at is missing", () => {
    const player: TrackPlayerInput = {
      state: "paused",
      attributes: {
        media_position: 75,
        media_duration: 180,
      },
    };

    const result = computeTrackPosition(player, baseTime);
    expect(result).not.toBeNull();
    expect(result?.currentPosition).toBe(75);
    expect(result?.prettyNow).toBe("01:15");
    expect(result?.prettyEnd).toBe("03:00");
  });

  it("works when playing even if media_position_updated_at is missing", () => {
    const player: TrackPlayerInput = {
      state: "playing",
      attributes: {
        media_position: 30,
        media_duration: 180,
      },
    };

    const result = computeTrackPosition(player, baseTime);
    expect(result).not.toBeNull();
    expect(result?.currentPosition).toBe(30);
    expect(result?.prettyNow).toBe("00:30");
  });

  it("handles invalid media_position_updated_at date string gracefully", () => {
    const player: TrackPlayerInput = {
      state: "playing",
      attributes: {
        media_position: 20,
        media_position_updated_at: "not-a-date",
        media_duration: 180,
      },
    };

    const result = computeTrackPosition(player, baseTime);
    expect(result).not.toBeNull();
    expect(result?.currentPosition).toBe(20);
    expect(result?.prettyNow).toBe("00:20");
  });

  it("handles clock skew where media_position_updated_at is in the future", () => {
    const updatedAt = new Date("2026-09-10T12:00:05Z").toISOString(); // 5s in future
    const now = new Date("2026-09-10T12:00:00Z");

    const player: TrackPlayerInput = {
      state: "playing",
      attributes: {
        media_position: 30,
        media_position_updated_at: updatedAt,
        media_duration: 180,
      },
    };

    const result = computeTrackPosition(player, now);
    expect(result?.currentPosition).toBe(30);
  });

  it("clamps currentPosition so it does not exceed media_duration", () => {
    const updatedAt = new Date("2026-09-10T12:00:00Z").toISOString();
    const now = new Date("2026-09-10T12:05:00Z"); // 300s later

    const player: TrackPlayerInput = {
      state: "playing",
      attributes: {
        media_position: 100,
        media_position_updated_at: updatedAt,
        media_duration: 180,
      },
    };

    const result = computeTrackPosition(player, now);
    expect(result?.currentPosition).toBe(180);
    expect(result?.prettyNow).toBe("03:00");
    expect(result?.prettyEnd).toBe("03:00");
  });

  it("formats hours properly when media_duration is >= 1 hour", () => {
    const player: TrackPlayerInput = {
      state: "paused",
      attributes: {
        media_position: 125, // 0:02:05
        media_duration: 3665, // 1:01:05
      },
    };

    const result = computeTrackPosition(player, baseTime);
    expect(result?.prettyNow).toBe("0:02:05");
    expect(result?.prettyEnd).toBe("1:01:05");
  });
});

describe("formatTrackTime", () => {
  it("formats standard minutes and seconds", () => {
    expect(formatTrackTime(0)).toBe("00:00");
    expect(formatTrackTime(5)).toBe("00:05");
    expect(formatTrackTime(65)).toBe("01:05");
    expect(formatTrackTime(354)).toBe("05:54");
  });

  it("never outputs 60 seconds due to rounding", () => {
    expect(formatTrackTime(59.9)).toBe("00:59");
    expect(formatTrackTime(60.0)).toBe("01:00");
  });

  it("formats hours when forced or when >= 3600 seconds", () => {
    expect(formatTrackTime(3600)).toBe("1:00:00");
    expect(formatTrackTime(3665)).toBe("1:01:05");
    expect(formatTrackTime(65, true)).toBe("0:01:05");
  });

  it("handles negative seconds safely", () => {
    expect(formatTrackTime(-10)).toBe("00:00");
  });
});
