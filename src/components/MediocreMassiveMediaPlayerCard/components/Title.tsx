import styled from "@emotion/styled";
import { usePlayer } from "@components";

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  color: var(--primary-text-color, #fff);
  padding-left: var(--mmpc-extra-horizontal-padding, 0px);
  padding-right: var(--mmpc-extra-horizontal-padding, 0px);
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
  const { title, subtitle } = usePlayer();

  return (
    <TitleWrap>
      {!!title && <TitleH2>{title}</TitleH2>}
      {!!subtitle && <TitleH3>{subtitle}</TitleH3>}
    </TitleWrap>
  );
};
