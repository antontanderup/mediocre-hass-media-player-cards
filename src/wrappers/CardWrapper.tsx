import { FunctionComponent, render } from "preact";
import {
  EmotionContextProvider,
  CardContextProvider,
  HassContextProvider,
} from "@components";
import { PlayerContextProvider } from "@components/PlayerContext";
import { HomeAssistant } from "custom-card-helpers";

export class CardWrapper<
  Config extends { entity_id: string },
> extends HTMLElement {
  Card: FunctionComponent = null;
  config: Config = null;
  shouldUpdate: (prevHass: HomeAssistant, hass: HomeAssistant) => boolean =
    null;
  private _previousHass = null;

  set hass(hass) {
    if (!this.Card) {
      throw new Error("Preact Card is not defined");
    }

    const entityId = this.config.entity_id;
    const shouldRender = this.shouldUpdate(this._previousHass, hass);

    if (shouldRender) {
      this._previousHass = hass;
      render(
        <EmotionContextProvider rootElement={this}>
          <CardContextProvider rootElement={this} config={this.config}>
            <HassContextProvider hass={hass}>
              <PlayerContextProvider hass={hass} entityId={entityId}>
                <this.Card />
              </PlayerContextProvider>
            </HassContextProvider>
          </CardContextProvider>
        </EmotionContextProvider>,
        this
      );
    } else {
      this._previousHass = hass;
    }
  }

  getCardSize() {
    return 1;
  }
}
