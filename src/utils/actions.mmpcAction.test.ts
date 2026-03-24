import { handleAction } from "./actions";
import type { HomeAssistant, InteractionConfig } from "@types";

describe("handleAction mmpc-action support", () => {
  it("dispatches an mmpc-action event for open-volume-panel", async () => {
    const element = {
      dispatchEvent: jest.fn(),
    } as unknown as HTMLElement;
    const hass = {
      callService: jest.fn(),
    } as unknown as HomeAssistant;
    const actionConfig: InteractionConfig = {
      tap_action: {
        action: "mmpc-action",
        mmpc_action: "open-volume-panel",
      },
    };

    await handleAction(element, actionConfig, "tap", hass);

    expect(hass.callService).not.toHaveBeenCalled();
    expect(element.dispatchEvent).toHaveBeenCalledTimes(1);
    const event = (element.dispatchEvent as jest.Mock).mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual(
      expect.objectContaining({
        action: "open-volume-panel",
        interaction: "tap",
      })
    );
  });
});
