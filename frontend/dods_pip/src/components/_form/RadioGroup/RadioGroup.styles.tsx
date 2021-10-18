import styled from 'styled-components';

import spacing from '../../../globals/spacing';

export const radioGroup = styled.div`
  width: 100%;
`;

export const radioGroupWrapper = styled.fieldset`
  border: 0;
  display: flex;
  flex-wrap: wrap;
  padding: 0;

  > * {
    margin-right: ${spacing(6)};
    margin-bottom: ${spacing(3)};
    flex-shrink: 0;

    &:last-child {
      margin-right: 0;
    }
  }
`;
