import styled from 'styled-components';

import media from '../../../globals/media';
import spacing from '../../../globals/spacing';

type WrapperProps = {
  isWelcome: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  ${({ isWelcome }) => media.greaterThan('md')`
    display: grid;
    grid-template-columns: ${
      !isWelcome
        ? `calc(50% - ${spacing(15)}) ${spacing(15)} ${spacing(15)} calc(
      50% - ${spacing(15)})`
        : `calc(50% - ${spacing(22)}) ${spacing(22)} ${spacing(22)} calc(
        50% - ${spacing(22)})`
    };
    grid-template-areas: 'main . . sidebar';

    > *:first-child {
      grid-area: main;
      margin-bottom: 0;
    }

    > *:last-child {
      grid-area: sidebar;
      padding-top: 0;
    }

    
  `}
`;
