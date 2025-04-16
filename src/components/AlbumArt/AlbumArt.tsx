import { Icon, usePlayer } from "@components";
import styled from "@emotion/styled";
import { getDeviceIcon } from "@utils";
import { ButtonHTMLAttributes, JSX } from "preact/compat";

export type AlbumArtProps = {
  size?: number | string;
  renderLongPressIndicator?: () => JSX.Element;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const AlbumArtContainer = styled.button<{
  $size?: number | string;
}>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px;
  margin: 0px;
  width: 100%;
  position: relative;
  overflow: hidden;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%; /* Creates 1:1 aspect ratio */
  }
  ${props => {
    if (props.$size) {
      return typeof props.$size === "string"
        ? `
      width: ${props.$size};
      height: ${props.$size};`
        : `
      width: ${props.$size}px;
      height: ${props.$size}px;`;
    }
    return "height: 100%;";
  }}
`;

const ContentContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledImage = styled.img`
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 4px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  --icon-primary-color: var(--card-background-color);
  background-color: var(--primary-text-color);
  opacity: 0.5;
  border-radius: 4px;
  height: 100%;
  aspect-ratio: 1 / 1;
`;

export const AlbumArt = ({
  size,
  renderLongPressIndicator,
  ...buttonProps
}: AlbumArtProps) => {
  const player = usePlayer();
  const {
    media_title: title,
    media_artist: artist,
    entity_picture: albumArt,
    icon,
    device_class: deviceClass,
    source,
  } = player.attributes;
  const state = player.state;

  return (
    <AlbumArtContainer $size={size} {...buttonProps}>
      <ContentContainer>
        {albumArt && state !== "off" ? (
          <StyledImage
            src={albumArt}
            alt={
              !!title && !!artist
                ? `${title} by ${artist}`
                : `Source: ${source}`
            }
          />
        ) : (
          <IconContainer>
            <Icon
              icon={
                state === "off"
                  ? getDeviceIcon({ icon, deviceClass })
                  : getSourceIcon({ source })
              }
              size="large"
            />
          </IconContainer>
        )}
      </ContentContainer>
      {renderLongPressIndicator && renderLongPressIndicator()}
    </AlbumArtContainer>
  );
};

const getSourceIcon = ({ source }: { source: string }) => {
  switch (source?.toLowerCase()) {
    case "spotify":
      return "mdi:spotify";
    case "airplay":
      return "mdi:airplay";
    case "bluetooth":
      return "mdi:bluetooth";
    case "net radio":
      return "mdi:radio";
    case "server":
      return "mdi:server";
    case "usb":
      return "mdi:usb";
    case "aux":
      return "mdi:audio-input-rca";
    case "hdmi":
      return "mdi:hdmi-port";
    case "tv":
      return "mdi:television";
    case "tuner":
      return "mdi:radio-tower";
    case "optical":
      return "mdi:audio-input-stereo-minijack";
    default:
      return "mdi:music";
  }
};
