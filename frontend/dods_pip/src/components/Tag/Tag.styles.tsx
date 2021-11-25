import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';
import { Size } from './';

type WrapperProps = {
  width: string;
  size: string;
  bgColor?: string;
};

export const wrapper = styled.div<WrapperProps>`
  cursor: pointer;
  display: inline-block;
  border: 1px solid ${color.base.greyLight};
  background: ${color.base.white};
  border-radius: 20px;
  padding: ${spacing(1)};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: ${({ width, size }) =>
    width === 'fixed' ? (size === 'medium' ? '180px' : '140px') : 'auto'};
  background-color: ${({ bgColor }) => bgColor === 'white' && color.base.white};
`;

export const textWrapper = styled.div`
  width: 100%;
  justify-self: stretch;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 ${spacing(2)};

  > * {
    width: 100%;
  }
`;

type IconWrapperType = {
  size: Size;
};

export const iconWrapper = styled.div<IconWrapperType>`
  width: ${({ size }) => (size === 'medium' ? spacing(8) : spacing(6))};
  height: ${({ size }) => (size === 'medium' ? spacing(8) : spacing(6))};
  border-width: 1px;
  border-radius: 50%;
  border-style: solid;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
