import styled from "@emotion/styled";
import { Icon, usePlayer } from "@components";
import { Fragment } from "preact/jsx-runtime";
import { useState } from "preact/hooks";

const ImgOuter = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
`;

const ImgWrap = styled.div`
  position: relative;
  aspect-ratio: 1;
  max-height: 95%;
  overflow: hidden;
  border-radius: 8px;
  align-self: center;
  margin-top: 8px;
  margin-bottom: 8px;
  box-shadow: 0px 0px 8px var(--clear-background-color);
  font-size: 0; /* Hide any text that might be displayed inside */
`;

const Img = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background-color: var(--card-background-color);
  color: transparent; /* Hide alt text if it shows */
  text-indent: -10000px; /* Move alt text off-screen */
`;

const SourceIndicator = styled.div<{ $centered: boolean }>`
  position: absolute;
  bottom: 6px;
  right: 6px;
  --icon-primary-color: var(--art-on-art-color, --primary-text-color);
  opacity: 0.8;
  ${props => {
    if (props.$centered) {
      return `
        bottom: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        --icon-primary-color: var(--card-background-color);
        background-color: var(--primary-text-color);
        opacity: 0.5;
        `;
    }
    return "";
  }}
`;

export const AlbumArt = () => {
  const player = usePlayer();
  const {
    media_title: title,
    media_artist: artist,
    entity_picture: albumArt,
    source,
  } = player.attributes;
  const state = player.state;

  const [error, setError] = useState(false);
  const hasAlbumArt = !!albumArt && !error;

  return (
    <ImgOuter>
      <ImgWrap>
        <Fragment>
          {!!albumArt && (
            <Img
              src={albumArt}
              onLoad={() => {
                setError(false);
              }}
              onError={() => {
                setError(true);
              }}
              alt={
                !!title && !!artist
                  ? `${title} by ${artist}`
                  : `Source: ${source}`
              }
            />
          )}
          {!hasAlbumArt && (
            <Img
              src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='400'%20viewBox='0%200%20400%20400'%3E%3Crect%20width='400'%20height='400'%20fill='transparent'/%3E%3C/svg%3E"
              alt="Album art fallback"
            />
          )}
          <SourceIndicator $centered={!hasAlbumArt}>
            <Icon
              size={!hasAlbumArt ? "x-large" : "x-small"}
              icon={getIcon({ source, state })}
            />
          </SourceIndicator>
        </Fragment>
      </ImgWrap>
    </ImgOuter>
  );
};

const getIcon = ({ source, state }: { source: string; state: string }) => {
  if (state === "off") return "mdi:power-off";
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
