import styled from 'styled-components';

import spacing from '../../../globals/spacing';

export const wrapper = styled.div`
  display: flex;
  justify-content: center;

  > * {
    margin-right: ${spacing(2)};

    &:last-child {
      margin-right: 0;
    }
  }
`;
