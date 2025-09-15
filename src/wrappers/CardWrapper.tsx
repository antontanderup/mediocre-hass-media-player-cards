import { FunctionComponent, render } from "preact";
import {
  EmotionContextProvider,
  CardContextProvider,
  HassContextProvider,
} from "@components";
import { PlayerContextProvider } from "@components/PlayerContext";
import { HomeAssistant } from "@types";

export class CardWrapper<
  Config extends { entity_id: string },
> extends HTMLElement {
  Card: FunctionComponent | null = null;
  config: Config | null = null;
  providePlayerContext = true;

  set hass(hass: HomeAssistant) {
    if (!this.Card) {
      throw new Error("Preact Card is not defined");
    }

    const entityId = this.config?.entity_id;
    const shouldRender = !!entityId;

    if (shouldRender) {
      render(
        <EmotionContextProvider rootElement={this}>
          <CardContextProvider rootElement={this} config={this.config}>
            <HassContextProvider hass={hass}>
              {this.providePlayerContext ? (
                <PlayerContextProvider hass={hass} entityId={entityId}>
                  <this.Card />
                </PlayerContextProvider>
              ) : (
                <this.Card />
              )}
            </HassContextProvider>
          </CardContextProvider>
        </EmotionContextProvider>,
        this
      );
    }
  }

  getCardSize() {
    return 1;
  }
}
