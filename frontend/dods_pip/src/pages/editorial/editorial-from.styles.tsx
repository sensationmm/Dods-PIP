import styled from 'styled-components';

import spacing from '../../globals/spacing';

export const mainColumns = styled.div`
  display: flex;

  > *:first-of-type {
    width: 75%;
    margin-right: ${spacing(5)};
  }
`;

export const inputFields = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  > * {
    width: calc(50% - ${spacing(2.5)}) !important;
    margin-bottom: ${spacing(5)};
  }
`;
