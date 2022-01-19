import React from 'react';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Input, { InputBaseProps } from '../InputBase';
import * as Styled from './InputSearch.styles';

export interface InputSearchProps extends Omit<InputBaseProps, 'type'> {
  onClear?: () => void;
}

const InputSearch: React.FC<InputSearchProps> = ({
  id,
  size,
  label,
  value,
  isDisabled = false,
  error,
  required,
  optional,
  helperText,
  onKeyDown,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Search...',
  children,
  testId,
  onClear,
}) => {
  const isFilled = value.length > 0;
  return (
    <Styled.wrapper isFilled={isFilled}>
      <Input
        id={id}
        testId={testId}
        data-test="component-input-search"
        type="text"
        size={size}
        label={label}
        value={value}
        isDisabled={isDisabled}
        error={error}
        required={required}
        optional={optional}
        helperText={helperText}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
      >
        <Icon
          data-test="input-prefix-icon"
          src={Icons.Search}
          size={IconSize.medium}
          color={
            !isDisabled
              ? typeof error !== 'string'
                ? color.theme.blueMid
                : color.alert.red
              : color.base.grey
          }
        />
        {children}

        {!isDisabled && (
          <Styled.clear
            data-test="input-clear"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
          >
            <Icon
              src={Icons.Cross}
              size={IconSize.medium}
              color={isFilled ? color.theme.blue : 'transparent'}
            />
          </Styled.clear>
        )}
      </Input>
    </Styled.wrapper>
  );
};

export default InputSearch;
