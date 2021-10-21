import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const textWrapper = styled.div`
  margin-left: ${spacing(3)};
`;

type BadgeBaseProps = {
  size?: string;
};

export const badgeBase = styled.div<BadgeBaseProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: ${({ size }) => (size === 'small' ? '23px' : '28px')};
  height: ${({ size }) => (size === 'small' ? '24px' : '30px')};
`;

export const infoGrey = styled(badgeBase)`
  background-color: ${color.base.greyDark};
  border: 1px solid ${color.base.greyDark};
`;

export const infoLight = styled(badgeBase)`
  background-color: ${color.shadow.blue};
  border: 1px solid ${color.base.greyLight};
`;

export const infoDark = styled(badgeBase)`
  background-color: ${color.theme.blue};
  border: 1px solid ${color.theme.blue};
`;

export const infoBlue = styled(badgeBase)`
  background-color: ${color.theme.blueLight};
  border: 1px solid ${color.theme.blueLight};
`;

export const confirm = styled(badgeBase)`
  background-color: ${color.alert.green};
  border: 1px solid ${color.alert.green};
`;

export const warn = styled(badgeBase)`
  background-color: ${color.alert.orange};
  border: 1px solid ${color.alert.orange};
`;

export const danger = styled(badgeBase)`
  background-color: ${color.alert.red};
  border: 1px solid ${color.alert.red};
`;
