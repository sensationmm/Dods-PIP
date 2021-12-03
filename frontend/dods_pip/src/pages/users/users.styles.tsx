import styled from 'styled-components';

import spacing from '../../globals/spacing';

export const content = styled.div`
  margin: 0 auto;

  > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: ${spacing(5)};
    grid-row-gap: ${spacing(6)};
  }
`;

export const passwordReset = styled.div`
  display: flex;
  padding-top: 30px;
`;
