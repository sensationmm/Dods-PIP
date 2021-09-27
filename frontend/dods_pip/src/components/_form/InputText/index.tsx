import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Input, { InputBaseProps } from '../InputBase';
import * as Styled from './InputText.styles';

export interface InputTextProps extends Omit<InputBaseProps, 'type'> {
  icon?: Icons;
}

const InputText: React.FC<InputTextProps> = ({
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
  icon,
  placeholder,
  children,
}) => {
  return (
    <Styled.wrapper className={classNames({ icon: icon !== undefined })}>
      <Input
        id={id}
        data-test="component-input-text"
        type="text"
        size={size}
        label={label}
        value={value}
        isDisabled={isDisabled}
        error={error}
        required={required}
        optional={optional}
        helperText={helperText}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex={tabIndex}
        placeholder={placeholder}
      >
        {children}
        {icon && (
          <div onClick={onFocus}>
            <Icon
              src={icon}
              size={IconSize.medium}
              color={
                !isDisabled
                  ? typeof error !== 'string'
                    ? color.theme.blueMid
                    : color.alert.red
                  : color.base.grey
              }
            />
          </div>
        )}
      </Input>
    </Styled.wrapper>
  );
};

export default InputText;
