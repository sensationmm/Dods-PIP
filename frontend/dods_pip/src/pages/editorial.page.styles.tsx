import styled from 'styled-components';

import { Icon } from '../components/Icon/Icon.styles';
import spacing from '../globals/spacing';

export const row = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const column = styled.div`
  display: flex;

  *:not(:last-child) {
    margin-right: ${spacing(3)};
  }
`;

export const tableHeader = styled.div`
  flex-shrink: 0;
`;

export const dateFilter = styled.div`
  > div > div > div {
    display: flex;
    align-items: center;
  }

  label {
    margin-bottom: 0;
  }

  *:not(:last-child) {
    margin-right: ${spacing(3)};
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
