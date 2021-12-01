import styled from 'styled-components';

import { wrapper as Avatar } from '../../components/Avatar/Avatar.styles';
import spacing from '../../globals/spacing';

export const headerOuter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  ${Avatar} {
    margin-right: ${spacing(6)};
  }
`;

export const actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  > div {
    margin-left: ${spacing(1)};
  }
`;
