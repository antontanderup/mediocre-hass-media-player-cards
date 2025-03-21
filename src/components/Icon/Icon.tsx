import styled from "@emotion/styled";
import { MdiReactIconComponentType } from "mdi-preact";
import { Fragment } from "preact";

export type IconSize =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large";

export type IconProps = {
  Icon: MdiReactIconComponentType | string;
  size?: IconSize;
  disabled?: boolean;
  className?: string;
};

const IconWrap = styled.div<{
  $size: IconSize;
}>`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${(props) => getIconSize(props.$size)}px;
  aspect-ratio: 1;

  > ha-icon {
    --mdc-icon-size: ${(props) => getIconSize(props.$size)}px;
    width: ${(props) => getIconSize(props.$size)}px;
    display: flex;
  }
`;

export const Icon = ({ Icon, size = "medium", className }: IconProps) => {
  const width = getIconSize(size);
  return (
    <IconWrap $size={size} className={className}>
      {typeof Icon === "string" ? (
        <Fragment>
          <ha-icon icon={Icon} />
        </Fragment>
      ) : (
        <Icon size={width} />
      )}
    </IconWrap>
  );
};

const getIconSize = (size: IconSize) => {
  switch (size) {
    case "xx-small":
      return 12;
    case "x-small":
      return 18;
    case "small":
      return 24;
    case "medium":
      return 32;
    case "large":
      return 48;
    case "x-large":
      return 80;
  }
};
