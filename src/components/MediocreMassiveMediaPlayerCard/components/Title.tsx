import { useContext } from "preact/hooks";
import styled from "@emotion/styled";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMassiveMediaPlayerCardConfig } from "../../MediaPlayerCommon";

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  > h2,
  > h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }
`;

const TitleH2 = styled.h2`
  margin: 0px;
`;

const TitleH3 = styled.h3`
  margin: 0px;
  font-weight: normal;
`;

export const Title = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const title = hass.states[config.entity_id].attributes?.media_title;
  const artist = hass.states[config.entity_id].attributes?.media_artist;
  const albumName = hass.states[config.entity_id].attributes?.media_album_name;
  if (!title && !artist && !albumName) {
    return null;
  }
  return (
    <TitleWrap>
      {!!title && <TitleH2>{title}</TitleH2>}
      {(!!albumName || !!artist) && (
        <TitleH3>{`${albumName ?? ""} - ${artist ?? ""}`}</TitleH3>
      )}
    </TitleWrap>
  );
};
