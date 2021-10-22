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

type inputBaseProps = {
  disabled: boolean;
};
export const input = styled.input<inputBaseProps>`
  width: 100%;
  border: 0;
  border-color: ${({ disabled }) => disabled && color.base.greyMid};
  outline: 0;
  background: ${({ disabled }) => (!disabled ? color.shadow.blue : color.base.greyLight)};
  margin-bottom: 2px;
  border-radius: 8px;
  color: ${({ disabled }) => (!disabled ? color.theme.blueMid : color.base.greyMid)};
  padding: ${spacing(3)};
  box-sizing: border-box;
  font-family: 'Open Sans';
  font-size: 16px;
  pointer-events: ${({ disabled }) => disabled && 'none'};
  cursor: ${({ disabled }) => disabled && 'not-allowed'};

  ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: ${color.base.grey};
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: ${color.base.grey};
    opacity: 1;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: ${color.base.grey};
    opacity: 1;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${color.base.grey};
  }
  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${color.base.grey};
  }
  ::placeholder {
    /* Most modern browsers support this now. */
    color: ${color.base.grey};
  }

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

  &:disabled {
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
      color: ${color.base.greyDark};
    }
  }

  &.error {
    color: ${color.alert.red};
    border-color: ${color.alert.red};
    background: ${color.shadow.red};
  }

  &.small {
    padding: ${spacing(1)} ${spacing(3)};
  }

  &.medium {
    padding: ${spacing(2)} ${spacing(3)};
  }
`;
