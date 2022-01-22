import styled from 'styled-components';

import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type HeaderContentProps = {
  closed: boolean;
};

export const headerContent = styled.div<HeaderContentProps>`
  width: calc(100% - 35px - ${spacing(2)});
  opacity: ${({ closed }) => (closed ? 0.4 : 1)};
`;

export const content = styled.div`
  padding-top: ${spacing(12)};
`;

export const headerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
