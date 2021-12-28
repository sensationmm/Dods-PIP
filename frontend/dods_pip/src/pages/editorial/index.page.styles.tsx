import styled from 'styled-components';

import { Icon } from '../../components/Icon/Icon.styles';
import media from '../../globals/media';
import spacing from '../../globals/spacing';

export const row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  ${media.greaterThan('sm')`
    flex-direction: row;
  `}
`;

export const column = styled.div`
  *:not(:last-child) {
    margin-bottom: ${spacing(3)};
  }

  ${media.greaterThan('sm')`
    display: flex;
  
    *:not(:last-child) {
      margin-right: ${spacing(3)};
      margin-bottom: 0
    }
  `}
`;

export const searchWrapper = styled(column)`
  ${media.greaterThan('sm')`
     margin-left: ${spacing(3)};
     width: 25%;
  `}
`;

export const tableHeader = styled.div`
  flex-shrink: 0;

  ${media.lessThan('sm')`
    margin-bottom: ${spacing(3)}
  `}
`;

export const dateFilter = styled.div`
  > div > div > div {
    display: flex;
    align-items: center;
  }
`;

export const filterToggle = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0;
  background: none;
  border: none;

  ${Icon} {
    margin-left: ${spacing(4)};
  }
`;
