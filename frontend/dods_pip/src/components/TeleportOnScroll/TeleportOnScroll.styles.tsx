import styled, { keyframes } from 'styled-components';

type TeleportStyleProps = {
  isSticky: boolean;
  stickyPos: 'top' | 'bottom';
  stickyBuffer: number;
};

const ANIMATION_DURATION = 200;

const animateFadeIn = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

export const teleportedEl = styled.div.attrs(
  ({ isSticky = false, stickyPos = 'bottom', stickyBuffer = 0 }: TeleportStyleProps) => {
    return {
      isSticky,
      stickyPos,
      stickyBuffer,
    };
  },
)`
  animation: ${animateFadeIn} ${ANIMATION_DURATION}ms ${ANIMATION_DURATION * 0.6}ms both;
  ${({ isSticky, stickyPos, stickyBuffer }) =>
    isSticky &&
    `
        position: sticky;
        ${stickyPos}: ${stickyBuffer};
        z-index: 10
    `}
`;
