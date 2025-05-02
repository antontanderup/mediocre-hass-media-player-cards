import { Icon } from "@components/Icon";
import styled from "@emotion/styled";

const MediaImageDiv = styled.div<{ imageUrl?: string | null }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  background-image: ${props =>
    props.imageUrl
      ? `url(${props.imageUrl})`
      : `background-color: var(--primary-text-color)`};
  --icon-primary-color: var(--card-background-color);
`;

export type MediaImageProps = {
  imageUrl?: string | null;
  className?: string;
};

export const MediaImage = ({ imageUrl, className }: MediaImageProps) => {
  return (
    <MediaImageDiv imageUrl={imageUrl} className={className}>
      {!imageUrl && <Icon icon="mdi:image-broken-variant" size="small" />}
    </MediaImageDiv>
  );
};
