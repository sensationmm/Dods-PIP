import styled, { keyframes } from 'styled-components';

import { Icon } from '../../components/Icon/Icon.styles';
import media from '../../globals/media';
import spacing from '../../globals/spacing';

const animateSlideIn = keyframes`
  0% { max-height: 0vh; padding: 0; opacity: 0; overflow: hidden }
  100% { max-height: 100vh; padding-top: ${spacing(4)}; overflow: visible }
`;

export const header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 48px;

  h1 {
    font-weight: 400;
  }
`;

export const filterContainer = styled.div``;

export const filterToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${Icon} {
    margin-left: ${spacing(4)};
  }
`;

export const filterToggleButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const filterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${animateSlideIn} 300ms 0ms both ease-in-out;
  overflow: hidden;
`;

export const filterContentCol = styled.div`
  display: flex;

  *:not(:last-child) {
    margin-right: ${spacing(3)};
  }
`;

export const searchWrapper = styled(filterContentCol)`
  ${media.greaterThan('sm')`
     margin-left: ${spacing(3)};
     width: 25%;
  `}
`;

export const teamList = styled.div`
  display: flex;
  min-width: 178px;
  > * {
    margin-right: ${spacing(1)};
    &:last-of-type {
      margin-right: 0;
    }
  }
`;
