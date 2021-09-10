import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';

export const topArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const wrapper = styled.div`
  width: 100%;
`;

type TextAreaProps = {
  disabled: boolean;
  inline?: boolean;
};

export const textarea = styled.textarea<TextAreaProps>`
  width: 100%;
  border: 0;
  outline: 0;
  background: ${({ inline }) => !inline && color.shadow.blue};
  margin-bottom: 1px;
  border-radius: 8px 8px 0 0;
  color: ${color.theme.blueMid};
  font-size: 14px;
  padding: ${spacing(3)};
  box-sizing: border-box;
  font-family: 'Open Sans';
  font-size: 16px;
  resize: none;

  &:hover {
    border-bottom: ${({ inline }) => !inline && `1px solid ${color.theme.blueMid}`};
  }
  &:focus {
    margin-bottom: 0;
    border-bottom: ${({ inline }) => !inline && `2px solid ${color.theme.blueMid}`};
    color: ${color.base.black};
  }

  &.error {
    color: ${color.theme.blueDark};
    border-color: ${color.alert.red};
    background: ${color.shadow.red};
    ::placeholder {
      color: ${({ disabled }) => (disabled ? color.base.grey : color.alert.red)};
    }
  }

  &:disabled {
    color: ${color.base.grey};
    border-color: ${color.base.grey};
    background: ${color.shadow.grey};
    pointer-events: none;
    cursor: not-allowed;
  }
`;

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
