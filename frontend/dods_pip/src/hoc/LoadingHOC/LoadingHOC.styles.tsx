import styled from 'styled-components';

import color from '../../globals/color';
import { hexAToRGBA } from '../../utils/color';

export const mask = styled.div`
  position: fixed;
  display: block;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${hexAToRGBA(color.base.black, 0.8)};
  opacity: 0;
  transition: opacity 0.3s linear;

  &.visible {
    opacity: 1;
    z-index: 1000;
  }
`;
