import styled from 'styled-components';

import spacing from '../../../globals/spacing';

type WrapperProps = {
  leftAlign: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  display: flex;
  justify-content: ${({ leftAlign }) => (leftAlign ? 'flex-start' : 'center')};

  > * {
    margin-right: ${spacing(2)};

    &:last-child {
      margin-right: 0;
    }
  }
`;
