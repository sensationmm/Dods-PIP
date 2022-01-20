import styled from 'styled-components';

import spacing from '../../globals/spacing';

export const dateInputs = styled.div`
  display: flex;
  gap: ${spacing(2)};
  align-items: center;
`;

export const radioItemsContainer = styled.div`
  fieldset {
    flex-direction: column;
    text-align: left;
  }
`;
