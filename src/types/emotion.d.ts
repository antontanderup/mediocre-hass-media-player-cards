/// <reference types="@emotion/react/types/css-prop" />

import "@emotion/react";

declare module "preact" {
  namespace JSX {
    interface HTMLAttributes {
      css?:
        | import("@emotion/react").SerializedStyles
        | import("@emotion/react").CSSObject
        | (import("@emotion/react").CSSObject | undefined | boolean)[]
        | string;
    }
    interface IntrinsicAttributes {
      css?:
        | import("@emotion/react").SerializedStyles
        | import("@emotion/react").CSSObject
        | (import("@emotion/react").CSSObject | undefined | boolean)[]
        | string;
    }
  }
}
