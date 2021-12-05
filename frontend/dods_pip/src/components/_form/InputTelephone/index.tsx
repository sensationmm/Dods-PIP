import React from 'react';

import Input, { InputBaseProps } from '../InputBase';
import * as Styled from './InputTelephone.styles';

export interface InputTelephoneProps extends Omit<InputBaseProps, 'type'> {}

const InputTelephone: React.FC<InputTelephoneProps> = ({
  id,
  size,
  label,
  value,
  isDisabled = false,
  error,
  required,
  optional,
  helperText,
  onChange,
  onFocus,
  onBlur,
  tabIndex,
  placeholder,
  testId,
}) => {
  const regex = new RegExp('^[0-9()+]*$');

  const onChangeHandler = (val: string) => {
    if (regex.test(val)) {
      onChange(val);
    }
  };

  const valueToShow = value.match(/[0-9()+]/g);

  return (
    <Styled.wrapper>
      <Input
        id={id}
        data-test="component-input-telephone"
        testId={testId}
        type="text"
        size={size}
        label={label}
        value={valueToShow?.join('') || ''}
        isDisabled={isDisabled}
        error={error}
        required={required}
        optional={optional}
        helperText={helperText}
        onChange={onChangeHandler}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex={tabIndex}
        placeholder={placeholder}
      />
    </Styled.wrapper>
  );
};

export default InputTelephone;
