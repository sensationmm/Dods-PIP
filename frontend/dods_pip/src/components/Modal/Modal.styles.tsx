import { Icon } from '@dods-ui/components/Icon/Icon.styles';
import styled, { keyframes } from 'styled-components';

import color from '../../globals/color';
import elevation from '../../globals/elevation';
import media from '../../globals/media';
import spacing from '../../globals/spacing';
import { modalSize } from './index';

const THEME: Record<modalSize, Record<string, string>> = {
  small: { width: '400px' },
  medium: { width: '540px' },
  large: { width: '780px' },
  xlarge: { width: '1280px' },
};

interface ModalStyleProps {
  size: modalSize;
  hasButtons: boolean;
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
  position: absolute;
  top: ${spacing(8)};
  right: ${spacing(8)};

  ${media.greaterThan('md')`
    top: ${spacing(10)};
  `};
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

export const modal = styled.div.attrs(({ size, hasButtons }: ModalStyleProps) => {
  return {
    width: THEME[size].width,
    height: THEME[size].height,
    hasButtons: hasButtons,
  };
})`
  margin: ${spacing(4)};
  animation: ${animateSlideInUp} ${ANIMATION_DURATION}ms ${ANIMATION_DURATION * 0.6}ms both;
  display: flex;
  flex-direction: column;
  max-width: ${({ width }) => width};
  max-height: calc(100vh - ${spacing(8)});
  width: 100%;
  background: ${color.base.white};
  border-radius: 8px;
  box-shadow: ${elevation.notification};
`;

export const modalHeader = styled.div`
  display: flex;
  width: calc(100% - 40px);
  justify-content: space-between;
  padding: ${spacing(4)};

  ${media.greaterThan('md')`
    padding: ${spacing(10)} ${spacing(8)};
  `};

  > ${Icon} {
    margin-right: ${spacing(4)};
  }
`;

export const modalHeaderTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  > ${Icon} {
    margin-right: ${spacing(5)};
  }
`;

export const titleAside = styled.div`
  display: flex;
  align-items: center;

  > * {
    margin-left: ${spacing(2)};
  }
`;

type ModalBodyProps = {
  canOverflow: boolean;
};
export const modalBody = styled.div<ModalBodyProps>`
  overflow-y: ${({ canOverflow }) => (canOverflow ? 'visible' : 'auto')};
  padding: 0 ${spacing(4)};
  height: 100%;

  ${media.greaterThan('md')`
    padding: 0 ${spacing(8)};
  `};
`;

type ModalFooterProps = {
  alignment: string;
};
export const modalFooter = styled.div<ModalFooterProps>`
  display: flex;
  justify-content: ${({ alignment }) => (alignment === 'right' ? 'flex-end' : 'center')};
  padding: ${spacing(4)};

  ${media.greaterThan('md')`
    padding: ${spacing(10)} ${spacing(8)};
  `};

  > *:not(:last-child) {
    margin-right: ${spacing(2)};
  }
`;
