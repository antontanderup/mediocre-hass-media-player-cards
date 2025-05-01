import styled from "@emotion/styled";

const MediaItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  @media (prefers-color-scheme: light) {
    background: rgba(0, 0, 0, 0.05);
  }
  &:hover {
    transform: translateY(-4px);
  }
`;

const MediaImage = styled.div<{ imageUrl?: string | null }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  background-image: ${props =>
    props.imageUrl
      ? `url(${props.imageUrl})`
      : `background: rgba(0, 0, 0, 0.10)`};
  margin-bottom: 8px;
`;

const MediaName = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
  color: var(--primary-text-color);
`;

const MediaArtist = styled.div`
  font-size: 12px;
  color: var(--secondary-text-color);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
`;

export type MediaItemProps = {
  imageUrl?: string | null;
  name: string;
  artist?: string;
  onClick: () => void;
};

export const MediaItem = ({
  imageUrl,
  name,
  artist,
  onClick,
}: MediaItemProps) => {
  return (
    <MediaItemContainer onClick={onClick}>
      <MediaImage imageUrl={imageUrl} />
      <MediaName>{name}</MediaName>
      <MediaArtist>{artist}</MediaArtist>
    </MediaItemContainer>
  );
};
