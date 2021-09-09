import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import * as Styled from './InputBase.styles';

type InputType = 'text' | 'search' | 'password';
type InputSize = 'small' | 'medium' | 'large';

export interface InputBaseProps {
  id: string;
  type: InputType;
  size?: InputSize;
  label?: string;
  value: string;
  isDisabled?: boolean;
  error?: string | undefined;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const InputBase: React.FC<InputBaseProps> = ({
  id,
  type,
  size = 'large',
  label,
  value,
  isDisabled = false,
  error = undefined,
  required = false,
  optional = false,
  helperText,
  onChange,
  children,
  placeholder,
}) => {
  return (
    <Styled.wrapper data-test="component-input-base">
      {label && (
        <Styled.label data-test="field-label">
          {required && <Styled.requiredStar>*</Styled.requiredStar>}
          <Text type="label" color={color.theme.blue}>
            {label}
          </Text>
          {required && <Styled.requiredLabel>(Required)</Styled.requiredLabel>}
          {!required && optional && <Styled.requiredLabel>(Optional)</Styled.requiredLabel>}
        </Styled.label>
      )}
      <Styled.inputWrapper>
        <Styled.input
          id={id}
          data-test="component-input-base-input"
          className={classNames({
            error: typeof error === 'string',
            disabled: isDisabled,
            small: size === 'small',
            medium: size === 'medium',
          })}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {children}
      </Styled.inputWrapper>
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
