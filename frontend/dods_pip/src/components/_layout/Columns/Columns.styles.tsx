import styled from 'styled-components';
import spacing from '../../../globals/spacing';

export const wrapper = styled.div`
  // > *:first-child {
  //   margin-bottom: ${spacing(10)};
  // }

  // > *:last-child {
  //   padding-top: ${spacing(15)};
  // }

  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: ${spacing(22)} calc(50% - ${spacing(44)}) ${spacing(22)} ${spacing(22)} calc(
        50% - ${spacing(22)}
      );
    grid-template-areas: '. main . . sidebar';

    > *:first-child {
      grid-area: main;
      margin-bottom: 0;
    }

    > *:last-child {
      grid-area: sidebar;
      padding-top: 0;
    }
  }
`;
