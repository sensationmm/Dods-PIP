import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import * as Styled from './InputBase.styles';

type InputType = 'text' | 'search' | 'password';

export interface InputBaseProps {
  id: string;
  type: InputType;
  label: string;
  value: string;
  isDisabled?: boolean;
  error?: string | undefined;
  helperText?: string;
  onChange: (val: string) => void;
}

const InputBase: React.FC<InputBaseProps> = ({
  id,
  type,
  label,
  value,
  isDisabled = false,
  error = undefined,
  helperText,
  onChange,
}) => {
  return (
    <Styled.wrapper data-test="component-input-base">
      <Styled.input
        id={id}
        data-test="component-input-base-input"
        className={classNames({ error: typeof error === 'string', disabled: isDisabled })}
        type={type}
        value={value || label}
        onChange={(e) => onChange(e.target.value)}
      />
      {(helperText || typeof error === 'string') && (
        <Text
          data-test="component-input-base-helper"
          type={'span'}
          color={
            !isDisabled
              ? typeof error !== 'string'
                ? color.theme.blueMid
                : color.alert.red
              : color.base.grey
          }
          bold={true}
        >
          {typeof error !== 'string' ? helperText : error}
        </Text>
      )}
    </Styled.wrapper>
  );
};

export default InputBase;