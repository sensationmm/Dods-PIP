import styled from 'styled-components';

import media from '../../../globals/media';
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

export const allocationTitle = styled.div`
  min-width: 40%;
`;

export const form = styled.fieldset`
  border: 0;
  padding: 0;
  display: grid;
  row-gap: ${spacing(6)};

  ${media.greaterThan('md')`
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: ${spacing(5)};
  `};
`;
