import { FunctionComponent, render } from "preact";
import { EmotionContextProvider, CardContextProvider } from "@components";

export class CardWrapper<Config> extends HTMLElement {
  Card: FunctionComponent = null;
  config: Config = null;

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
