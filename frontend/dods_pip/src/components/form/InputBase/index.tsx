import React from 'react';
import classNames from 'classnames';

import * as Styled from './InputBase.styles';
import Text from '../../Text';
import color from '../../../globals/color';

type InputType = 'text' | 'search' | 'password';

export interface InputBaseProps {
  type: InputType;
  label: string;
  value: string;
  isDisabled?: boolean;
  hasError?: boolean;
  helperText?: string;
  onChange: (val: any) => void;
}

const InputBase: React.FC<InputBaseProps> = ({
  type,
  label,
  value,
  isDisabled = false,
  hasError = false,
  helperText,
  onChange,
}) => {
  return (
    <Styled.wrapper data-test="component-input-base">
      <Styled.input
        data-test="component-input-base-input"
        className={classNames({ error: hasError, disabled: isDisabled })}
        type={type}
        value={value || label}
        onChange={onChange}
      />
      {helperText && (
        <Text
          data-test="component-input-base-helper"
          type={'span'}
          color={
            !isDisabled ? (!hasError ? color.theme.blueMid : color.alert.red) : color.base.grey
          }
          bold={true}
        >
          {helperText}
        </Text>
      )}
    </Styled.wrapper>
  );
};

export default InputBase;
