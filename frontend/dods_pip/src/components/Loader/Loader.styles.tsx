import styled from 'styled-components';

import { hexAToRGBA } from '../../utils/color';

import color from '../../globals/color';

export const mask = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  // background: ${hexAToRGBA(color.theme.blueDark, 0.4)};
`;
