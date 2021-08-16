import styled from 'styled-components';

import color from '../../globals/color';
import { hexAToRGBA } from '../../utils/color';

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
