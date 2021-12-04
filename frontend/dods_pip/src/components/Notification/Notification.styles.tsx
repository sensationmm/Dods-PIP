import styled, { keyframes } from 'styled-components';

import color from '../../globals/color';
import elevation from '../../globals/elevation';
import spacing from '../../globals/spacing';

const animSlideIn = keyframes`
  0% { opacity: 0; transform: translateX(100%); }
  100% { opacity: 1; transform: translateX(0%); }
`;

const animFadeOut = keyframes`
  0% { opacity: 1; transform: translateY(0%); margin-bottom: 0; }
  100% { opacity: 0; transform: translateY(-100%); margin-bottom: -80px; }
`;

type WrapperProps = {
  fadeOut: boolean;
};
export const wrapper = styled.div<WrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 640px;
  min-height: 80px;
  padding: ${spacing(4)} ${spacing(6)};
  background: ${color.base.white};
  border-radius: 8px;
  box-shadow: ${elevation.notification};
  animation-name: ${({ fadeOut }) => (fadeOut ? animFadeOut : animSlideIn)};
  animation-duration: 0.5s;
  animation-iteration-count: 1;
`;

export const content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const text = styled.div``;

export const icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: ${spacing(5)};
`;

export const iconAlert = styled(icon)`
  background-color: ${color.accent.orange};
`;

export const iconSuccess = styled(icon)`
  background-color: ${color.alert.green};
`;

export const iconIssue = styled(icon)`
  background-color: ${color.alert.red};
`;

export const iconInfo = styled(icon)`
  background-color: ${color.theme.blueMid};
`;

export const close = styled.div`
  cursor: pointer;
`;
