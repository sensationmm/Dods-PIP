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
  margin-bottom: 2px;
  border-radius: 8px;
  color: ${color.theme.blueMid};
  font-size: 14px;
  padding: ${spacing(3)};
  box-sizing: border-box;
  font-family: 'Open Sans';
  font-size: 16px;
  resize: none;

  &:hover {
    margin-bottom: 1px;
    border-bottom: ${({ inline }) => !inline && `1px solid ${color.theme.blueMid}`};
    border-radius: 8px 8px 0 0;
  }
  &:focus {
    margin-bottom: 0px;
    border-bottom: ${({ inline }) => !inline && `2px solid ${color.theme.blueMid}`};
    color: ${color.base.black};
    border-radius: 8px 8px 0 0;
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
    background: ${color.base.greyLight};
    pointer-events: none;
    cursor: not-allowed;
    ::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      color: ${color.base.greyDark};
    }
    :-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: ${color.base.greyDark};
      opacity: 1;
    }
    ::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: ${color.base.greyDark};
      opacity: 1;
    }
    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: ${color.base.greyDark};
    }
    ::-ms-input-placeholder {
      /* Microsoft Edge */
      color: ${color.base.greyDark};
    }

    ::placeholder {
      /* Most modern browsers support this now. */
      color: ${color.alert.red};
    }
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
