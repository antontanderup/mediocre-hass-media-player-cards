import { useContext, useEffect, useState } from "preact/hooks";
import styled from "styled-components";
import { CardContext, CardContextType } from "../../../utils";
import { Vibrant } from "node-vibrant/browser";
import { Icon } from "../../Icon";
import { Fragment } from "preact/jsx-runtime";
import { MediocreMediaPlayerCardConfig } from "../../MediaPlayerCommon";

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
`;

const Img = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background-color: var(--card-background-color);
`;

const SourceIndicator = styled.div<{ contrastColor?: string }>`
  position: absolute;
  bottom: 6px;
  right: 6px;
  color: var(--primary-text-color);
  ${(props) => (props.contrastColor ? `color: ${props.contrastColor};` : "")}
  opacity: 0.8;
`;

export const AlbumArt = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id } = config;
  const player = hass.states[entity_id];
  const {
    media_title: title,
    media_artist: artist,
    entity_picture: albumArt,
    source,
  } = player.attributes;
  const state = player.state;
  // State for average color
  const [contrastColor, setContrastColor] = useState<string | null>(null);

  // Reset average color when album art changes
  useEffect(() => {
    setContrastColor(null);
  }, [albumArt]);

  // Handle image load to calculate average color
  const handleImageLoad = () => {
    if (albumArt) {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
      Vibrant.from(albumArt)
        .getPalette()
        .then((palette) => {
          if (palette.DarkVibrant && palette.LightVibrant) {
            setContrastColor(
              isDarkMode
                ? palette.DarkVibrant.bodyTextColor
                : palette.LightVibrant.bodyTextColor
            );
          } else if (palette.DarkMuted && palette.LightMuted) {
            setContrastColor(
              isDarkMode
                ? palette.DarkMutedt.bodyTextColor
                : palette.DarkMuted.bodyTextColor
            );
          } else {
            setContrastColor(undefined);
          }
        })
        .catch((e) => {
          console.error("Error getting color with Vibrant:", e);
        });
    }
  };
  return (
    <ImgOuter>
      <ImgWrap>
        <Fragment>
          <Img
            src={
              albumArt ??
              "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='400'%20viewBox='0%200%20400%20400'%3E%3Crect%20width='400'%20height='400'%20fill='transparent'/%3E%3C/svg%3E"
            }
            alt={`${title} by ${artist}`}
            onLoad={handleImageLoad}
          />
          <SourceIndicator contrastColor={contrastColor}>
            <Icon size="x-small" Icon={getIcon({ source, state })} />
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
