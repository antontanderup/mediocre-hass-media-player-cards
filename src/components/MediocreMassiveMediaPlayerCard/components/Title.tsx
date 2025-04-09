import styled from "@emotion/styled";
import { usePlayer } from "@components/PlayerContext";

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  color: var(--primary-text-color, #fff);
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
  color: var(--secondary-text-color, #fff);
`;

export const Title = () => {
  const player = usePlayer();
  const title = player.attributes?.media_title;
  const artist = player.attributes?.media_artist;
  const albumName = player.attributes?.media_album_name;
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
