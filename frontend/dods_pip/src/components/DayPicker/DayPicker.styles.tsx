import color from '@dods-ui/globals/color';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

type WrapperProps = {
  disabled: boolean;
};
export const wrapper = styled.div<WrapperProps>`
  display: flex;
  border: 1px solid ${color.base.greyLight};
  border-radius: 10px;
  padding: ${spacing(1)};
  background: ${({ disabled }) => (!disabled ? 'none' : color.base.greyLight)};
`;

type DayProps = {
  selected: boolean;
  disabled: boolean;
};
export const day = styled.div<DayProps>`
  cursor: ${({ disabled }) => (!disabled ? 'pointer' : 'not-allowed')};
  padding: ${spacing(2)};
  color: ${({ selected, disabled }) =>
    selected && !disabled ? color.base.white : color.base.greyDark};
  background: ${({ selected, disabled }) =>
    selected ? (disabled ? color.base.greyMid : color.theme.blueMid) : 'transparent'};

  &:first-of-type {
    border-radius: 8px 0 0 8px;
  }

  &:last-of-type {
    border-radius: 0 8px 8px 0;
  }

  &:hover {
    background: ${({ selected, disabled }) =>
      selected
        ? disabled
          ? color.base.greyMid
          : color.theme.blue
        : disabled
        ? 'none'
        : color.base.greyLight};
  }
`;
