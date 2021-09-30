import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';
import { InputSize } from '.';

export const labelWrapper = styled.div`
  display: flex;
  margin-bottom: ${spacing(3)};
`;

export const requiredAsterisk = styled.div`
  margin-right: ${spacing(1)};
`;

export const requiredHelper = styled.div`
  margin-left: ${spacing(1)};
`;

type NumberInputType = {
  size?: InputSize;
  disabled?: boolean;
  error?: string | undefined;
};
export const InputArea = styled.div<NumberInputType>`
  display: flex;
  background: ${({ error, disabled }) =>
    disabled
      ? color.base.greyLight
      : typeof error === 'string'
      ? color.shadow.red
      : color.base.white};
  width: ${({ size }) =>
    size === 'large' ? spacing(38) : size === 'medium' ? spacing(34) : spacing(30)};
  border-radius: 8px;
  margin-bottom: ${spacing(2)};
`;
export const inputWrapper = styled.div`
  width: ${spacing(13)};
`;

type iconWrapperProps = {
  size?: InputSize;
  disabled?: boolean;
  error?: string | undefined;
};
export const iconWrapper = styled.button<iconWrapperProps>`
  background: ${({ error, disabled }) =>
    disabled
      ? color.base.greyMid
      : typeof error === 'string'
      ? color.alert.red
      : color.shadow.blue};
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) =>
    size === 'large' ? spacing(12) : size === 'medium' ? spacing(10) : spacing(8)};
  height: ${({ size }) =>
    size === 'large' ? spacing(12) : size === 'medium' ? spacing(10) : spacing(8)};
  border-radius: 8px;
  border: 0;
  margin-right: 1px;
  margin-left: 1px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

export const input = styled.input`
  width: 100%;
  border: 0;
  background: ${color.base.white};
  color: ${color.theme.blue};
  padding: ${spacing(3)};
  box-sizing: border-box;
  font-family: 'Open Sans';
  font-size: 16px;
  text-align: center;

  &:focus {
    color: ${color.theme.blue};
  }

  &.error {
    color: ${color.alert.red};
    background: ${color.shadow.red};
  }

  &.disabled {
    color: ${color.base.grey};
    border-color: ${color.base.grey};
    background: ${color.base.greyLight};
    pointer-events: none;
    cursor: not-allowed;
  }

  &.small {
    padding: ${spacing(1)} ${spacing(3)};
  }

  &.medium {
    padding: ${spacing(2)} ${spacing(3)};
  }
`;
