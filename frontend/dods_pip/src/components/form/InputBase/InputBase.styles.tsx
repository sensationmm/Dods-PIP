import styled from 'styled-components';
import color from '../../../globals/color';
import spacing from '../../../globals/spacing';

export const wrapper = styled.div`
  position: relative;
  width: 100%;

  span {
    display: block;
    padding: ${spacing(2)} ${spacing(3)} 0 ${spacing(3)};
    margin: 0;
  }
`;

export const input = styled.input`
  width: 100%;
  border: 0;
  outline: 0;
  background: ${color.shadow.blue};
  border-bottom: 1px solid ${color.theme.blueMid};
  margin-bottom: 1px;
  border-radius: 3px 3px 0 0;
  color: ${color.theme.blueMid};
  font-size: 14px;
  padding: ${spacing(3)};
  box-sizing: border-box;

  &:hover,
  &:focus {
    margin-bottom: 0;
    border-bottom-width: 2px;
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
`;
