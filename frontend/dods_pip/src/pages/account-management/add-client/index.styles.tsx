import styled from 'styled-components';

import spacing from '../../../globals/spacing';

export const wrapper = styled.div`
  width: 75%;
`;

export const locations = styled.div`
  display: flex;

  > div {
    margin-right: ${spacing(5)};
  }
`;

export const dates = styled.div`
  display: flex;

  > div {
    max-width: calc(33% - ${spacing(5)});
    margin-right: ${spacing(5)};
  }
`;
