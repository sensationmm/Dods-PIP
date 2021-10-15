import styled from 'styled-components';

import { wrapper as Notification } from '../../components/Notification/Notification.styles';
import color from '../../globals/color';
import media from '../../globals/media';
import spacing from '../../globals/spacing';
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

export const notifications = styled.div`
  position: fixed;
  top: ${spacing(3)};
  right: ${spacing(3)};
  z-index: 100;

  > ${Notification} {
    margin-bottom: ${spacing(2)};
  }

  ${media.greaterThan('xl')`
    right: ${spacing(20)};
  `};
`;
