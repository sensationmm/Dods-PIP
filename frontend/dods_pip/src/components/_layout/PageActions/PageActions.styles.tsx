import styled from 'styled-components';

import spacing from '../../../globals/spacing';

type WrapperProps = {
  leftAlign: boolean;
  rightAlign: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  display: flex;
  justify-content: ${({ leftAlign, rightAlign }) =>
    leftAlign ? 'flex-start' : rightAlign ? 'flex-end' : 'center'};

  > * {
    margin-right: ${spacing(2)};

    &:last-child {
      margin-right: 0;
    }
  }
`;
