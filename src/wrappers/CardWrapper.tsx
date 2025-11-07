import { FunctionComponent, render } from "preact";
import {
  EmotionContextProvider,
  CardContextProvider,
  HassContextProvider,
} from "@components";
import "./../i18n";
import { PlayerContextProvider } from "@components/PlayerContext";
import { HomeAssistant } from "@types";

export class CardWrapper<
  Config extends { entity_id: string },
> extends HTMLElement {
  Card: FunctionComponent | null = null;
  config: Config | null = null;
  providePlayerContext = true;

  shouldUpdate:
    | ((prevHass: HomeAssistant | null, hass: HomeAssistant | null) => boolean)
    | null = null;

  private _previousHass: HomeAssistant | null = null;
  private _previousConfig: Config | null = null;

  set hass(hass: HomeAssistant) {
    if (!this.Card) {
      throw new Error("Preact Card is not defined");
    }

    const entityId = this.config?.entity_id;
    const shouldRender =
      !!entityId &&
      (this.config !== this._previousConfig ||
        this.shouldUpdate?.(this._previousHass, hass));

    if (shouldRender) {
      this._previousHass = hass;
      this._previousConfig = this.config;
      render(
        <EmotionContextProvider rootElement={this}>
          <CardContextProvider rootElement={this} config={this.config}>
            <HassContextProvider hass={hass}>
              {this.providePlayerContext ? (
                <PlayerContextProvider entityId={entityId}>
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
    } else {
      this._previousHass = hass;
    }
  }

  getCardSize() {
    return 1;
  }
}
