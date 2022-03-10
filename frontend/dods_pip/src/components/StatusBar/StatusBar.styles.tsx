import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

export const buttonSeparator = styled.div``;

type GroupProps = {
  reversed?: boolean;
};
export const group = styled.div<GroupProps>`
  display: flex;
  flex-direction: ${({ reversed = false }) => (reversed ? 'row-reverse' : 'row')};
  align-items: center;

  ${({ reversed = false }) =>
    reversed
      ? `${buttonSeparator} {margin-left: ${spacing(2)};

        &:last-child {
          margin-left: 0;
        }}`
      : `${buttonSeparator} {margin-right: ${spacing(2)};

        &:last-child {
          margin-right: 0;
        }}`}
`;

export const date = styled.div`
  margin-right: ${spacing(5)};
`;

export const tagWrapper = styled.div`
  margin-right: ${spacing(2)};
`;

type CardProps = {
  isTransparent?: boolean;
};

export const card = styled.div<CardProps>`
  padding-top: ${spacing(3)};
  padding-bottom: ${spacing(3)};
  height: ${spacing(20)};
  width: 100%;
  background-color: ${({ isTransparent }) =>
    isTransparent ? color.base.transparent : color.base.white};
  display: flex;
  justify-content: center;
`;

type ContainerProps = {
  containerized?: boolean;
};

export const container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  height: 100%;
  ${({ containerized }) =>
    containerized
      ? `
      padding-right: 15px;
      padding-left: 15px;
      width: 1170px;
  `
      : `
      width: 100%;
  `}
`;

export const inlineView = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing(2)};
`;

export const text = styled.div`
  margin-left: ${spacing(2)};
`;

export const publishWarning = styled.div`
  position: absolute;
  right: 5px;
  bottom: -25px;
`;
