import Preact, { render } from "preact";
import { CardContextProvider } from "../utils";

export class CardWrapper<T> extends HTMLElement {
  Card: Preact.FunctionComponent = null;
  config: T = null;

  set hass(hass) {
    if (!this.Card) {
      throw new Error("Preact Card is not defined");
    }
    render(
      <CardContextProvider rootElement={this} hass={hass} config={this.config}>
        <this.Card />
      </CardContextProvider>,
      this
    );
  }

  getCardSize() {
    return 1;
  }
}
