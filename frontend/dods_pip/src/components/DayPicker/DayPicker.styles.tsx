import color from '@dods-ui/globals/color';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

type WrapperProps = {
  disabled: boolean;
};
export const wrapper = styled.div<WrapperProps>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid ${color.base.greyLight};
  border-radius: 10px;
  padding: ${spacing(1)};
  background: ${({ disabled }) => (!disabled ? 'none' : color.base.greyLight)};
`;

type DayProps = {
  selected: boolean;
  disabled: boolean;
  clickable: boolean;
};
export const day = styled.div<DayProps>`
  cursor: ${({ disabled, clickable }) =>
    !disabled ? (clickable ? 'pointer' : 'default') : 'not-allowed'};
  padding: ${spacing(2)};
  background: ${({ selected, disabled }) =>
    selected ? (disabled ? color.base.greyMid : color.theme.blueMid) : 'transparent'};
  pointer-events: ${({ clickable, disabled }) => (!clickable && !disabled ? 'none' : 'default')};
  display: flex;
  justify-content: center;

  ${({ disabled }) => disabled && 'pointer-events: none;'}

  &:first-of-type {
    border-radius: 8px 0 0 8px;
  }

  &:last-of-type {
    border-radius: 0 8px 8px 0;
  }

  &:hover {
    background: ${({ selected }) => (selected ? color.theme.blue : color.base.greyLight)};
  }
`;
