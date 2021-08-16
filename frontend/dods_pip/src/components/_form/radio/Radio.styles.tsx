import styled from 'styled-components';

import color from '../../../globals/color';
import opacity from '../../../globals/opacity';
import spacing from '../../../globals/spacing';

const colorDefault = color.theme.blueMid;
const colorHover = color.theme.blueDark;
const colorDisabled = color.base.grey;

export const radio = styled.div`
  display: flex;
  align-items: center;
`;

export const radioInput = styled.input`
  position: relative;
  width: 24px !important;
  height: 24px !important;
  margin: 0 ${spacing(3)} 0 0;
  cursor: pointer;
  outline: none;
  border: 0;
  background: transparent;

  &:focus::before {
    content: '';
    display: block;
    position: absolute;
    top: -4px;
    left: -4px;
    width: 30px;
    height: 30px;
    border-radius: 16px;
    background: ${colorDefault};
    opacity: ${opacity.high};
  }

  &::before {
    content: '';
    display: block;
    width: 22px;
    height: 22px;
    border-radius: 12px;
    border: 1px solid ${colorDefault};
    background: ${color.base.white};
    outline: none;
  }

  &:checked:after {
    content: '';
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    top: 4px;
    left: 4px;
    background: ${colorDefault};
  }

  &:hover::before {
    border-color: ${colorHover};
  }

  &:checked:hover:after {
    background: ${colorHover};
  }
`;

export const radioInputDisabled = styled(radioInput)`
  pointer-events: none;
  cursor: not-allowed;

  &::before {
    border-color: ${colorDisabled};
  }
  &:checked:after {
    background: ${colorDisabled};
  }
`;

export const radioGroup = styled.div``;
export const button = styled.div``;
export const radioGroupWrapper = styled.div``;
