import Preact, { render } from "preact";
import { CardContextProvider } from "../utils";
import { EmotionContextProvider } from "./EmotionContextProvider";

export class CardWrapper<T> extends HTMLElement {
  Card: Preact.FunctionComponent = null;
  config: T = null;

  set hass(hass) {
    if (!this.Card) {
      throw new Error("Preact Card is not defined");
    }
    render(
      <EmotionContextProvider rootElement={this}>
        <CardContextProvider
          rootElement={this}
          hass={hass}
          config={this.config}
        >
          <this.Card />
        </CardContextProvider>
      </EmotionContextProvider>,
      this
    );
  }

  getCardSize() {
    return 1;
  }
}
