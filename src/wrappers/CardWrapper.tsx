import { FunctionComponent, render } from "preact";
import {
  EmotionContextProvider,
  CardContextProvider,
  HassContextProvider,
} from "@components";
import { PlayerContextProvider } from "@components/PlayerContext";

export class CardWrapper<
  Config extends { entity_id: string },
> extends HTMLElement {
  Card: FunctionComponent = null;
  config: Config = null;

  set hass(hass) {
    if (!this.Card) {
      throw new Error("Preact Card is not defined");
    }
    render(
      <EmotionContextProvider rootElement={this}>
        <CardContextProvider rootElement={this} config={this.config}>
          <HassContextProvider hass={hass}>
            <PlayerContextProvider hass={hass} entityId={this.config.entity_id}>
              <this.Card />
            </PlayerContextProvider>
          </HassContextProvider>
        </CardContextProvider>
      </EmotionContextProvider>,
      this
    );
  }

  getCardSize() {
    return 1;
  }
}
