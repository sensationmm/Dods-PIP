import styled, { keyframes } from 'styled-components';

import color from '../../globals/color';
import elevation from '../../globals/elevation';
import spacing from '../../globals/spacing';
import { modalSize } from './index';

const THEME: Record<modalSize, Record<string, string>> = {
  small: { width: '400px', height: '288px' },
  medium: { width: '540px', height: '368px' },
  large: { width: '780px', height: '470px' },
  xlarge: { width: '1280px', height: '1027px' },
};

interface ModalStyleProps {
  size: modalSize;
}

const ANIMATION_DURATION = 200;

const animateFadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const animateSlideInUp = keyframes`
  0% { opacity: 0; transform: translateY(0); }
  100% { opacity: 1; transform: translateY(-10px); }
`;

export const closeButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

export const veil = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${animateFadeIn} ${ANIMATION_DURATION}ms 0ms both;
  transition: all 0.3s ease-in-out;
  z-index: 1000;
`;

export const modal = styled.div.attrs(({ size }: ModalStyleProps) => {
  return {
    width: THEME[size].width,
    height: THEME[size].height,
  };
})`
  margin: ${spacing(4)};
  animation: ${animateSlideInUp} ${ANIMATION_DURATION}ms ${ANIMATION_DURATION * 0.6}ms both;
  display: flex;
  flex-direction: column;
  max-width: ${({ width }) => width};
  height: ${({ height }) => height};
  max-height: calc(100vh - ${spacing(8)});
  width: 100%;
  background: ${color.base.white};
  border-radius: 8px;
  box-shadow: ${elevation.notification};
`;

export const modalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing(4)};
`;

export const modalBody = styled.div`
  overflow-y: scroll;
  padding: 0 ${spacing(4)};
  height: 100%;
`;

export const modalFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: ${spacing(4)};

  > *:not(last-child) {
    margin-right: ${spacing(2)};
  }
`;
