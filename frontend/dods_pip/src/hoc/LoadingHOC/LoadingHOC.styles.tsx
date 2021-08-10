import styled from 'styled-components';

import color from '../../globals/color';
import opacity from '../../globals/opacity';
import { hexAToRGBA } from '../../utils/color';

export const mask = styled.div`
  position: fixed;
  display: none;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${hexAToRGBA(color.base.black, opacity.low)};

  &.visible {
    display: block;
  }
`;
