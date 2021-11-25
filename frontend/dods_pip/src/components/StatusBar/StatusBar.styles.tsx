import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const group = styled.div`
  display: flex;
  align-items: center;
`;

export const date = styled.div`
  margin-right: ${spacing(5)};
`;

export const buttonSeparator = styled.div`
  margin-right: ${spacing(2)};
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

  &:hover {
    box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.25);
  }
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
