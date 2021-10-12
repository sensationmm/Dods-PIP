import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';

export const wrapper = styled.div`
  position: relative;
  width: 100%;

  > span {
    display: block;
    padding-top: ${spacing(2)};
    margin: 0;
  }
`;

export const inputWrapper = styled.div`
  position: relative;
`;

export const input = styled.input`
  width: 100%;
  border: 0;
  outline: 0;
  background: ${color.shadow.blue};
  margin-bottom: 2px;
  border-radius: 8px;
  color: ${color.theme.blueMid};
  padding: ${spacing(3)};
  box-sizing: border-box;
  font-family: 'Open Sans';
  font-size: 16px;

  &:hover {
    margin-bottom: 1px;
    border-bottom: 1px solid ${color.theme.blueMid};
    border-radius: 8px 8px 0 0;
  }

  &:focus {
    margin-bottom: 0;
    border-bottom: 2px solid ${color.theme.blueMid};
    border-radius: 8px 8px 0 0;
  }

  &:focus {
    color: ${color.base.black};
  }

  &.error {
    color: ${color.alert.red};
    border-color: ${color.alert.red};
    background: ${color.shadow.red};
  }

  &.disabled {
    color: ${color.base.grey};
    border-color: ${color.base.grey};
    background: ${color.shadow.grey};
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
