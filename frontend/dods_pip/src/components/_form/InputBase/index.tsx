import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import Label from '../Label';
import * as Styled from './InputBase.styles';

type InputType = 'text' | 'search' | 'password' | 'time';
type InputSize = 'small' | 'medium' | 'large';

export interface InputBaseProps {
  id: string;
  type: InputType;
  size?: InputSize;
  length?: number;
  label?: string;
  value: string;
  isDisabled?: boolean;
  error?: string | undefined;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onChange: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  tabIndex?: number;
  titleField?: boolean;
  testId?: string;
}

const InputBase: React.FC<InputBaseProps> = ({
  id,
  type,
  size = 'large',
  length = 1,
  label,
  value,
  isDisabled = false,
  error = undefined,
  required = false,
  optional = false,
  helperText,
  onKeyDown = () => {
    return false;
  },
  onChange,
  onFocus,
  onBlur,
  children,
  placeholder,
  tabIndex,
  titleField,
  testId,
}) => {
  return (
    <Styled.wrapper data-test="component-input-base">
      {label && (
        <Label
          label={label}
          required={required}
          optional={optional}
          isDisabled={isDisabled}
          htmlFor={id}
        />
      )}
      <Styled.inputWrapper>
        <Styled.input
          titleField={titleField}
          id={id}
          data-test="component-input-base-input"
          data-testid={testId}
          disabled={isDisabled}
          className={classNames({
            error: typeof error === 'string',
            small: size === 'small',
            medium: size === 'medium',
            titleField: titleField,
          })}
          type={type}
          value={value || ''}
          onKeyDown={(e) => onKeyDown(e)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          tabIndex={tabIndex}
          size={Math.max(placeholder?.length || 1, length || 1, value?.length || 1)}
          autoComplete="off"
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
