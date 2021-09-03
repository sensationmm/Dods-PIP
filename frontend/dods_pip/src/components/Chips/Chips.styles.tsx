import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

type WrapperProps = {
  selected?: boolean;
  disabled?: boolean;
};

type CloseButtonProps = {
  disabled?: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  display: inline-block;
  border: 1px solid ${color.shadow.grey};
  background: ${({ selected, disabled }) =>
    selected ? color.shadow.blue : disabled ? color.disabled.greyBackground : color.base.white};
  border-radius: 60px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${color.shadow.blue};
  }
  &.disabled {
    background: ${color.disabled.greyBackground};
    color: ${color.base.grey};
  }
`;
export const closeButton = styled.div<CloseButtonProps>`
  padding: ${spacing(1.5)};
  border-radius: 50%;
  background: ${({ disabled }) => (disabled ? color.base.grey : color.theme.blueMid)};
  margin-left: ${spacing(2.3)};
`;
