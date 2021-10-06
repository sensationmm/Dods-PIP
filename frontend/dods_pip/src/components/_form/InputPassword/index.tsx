import React from 'react';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Input, { InputBaseProps } from '../InputBase';
import * as Styled from './InputPassword.styles';

export interface InputPasswordProps extends Omit<InputBaseProps, 'type'> {}

const InputPassword: React.FC<InputPasswordProps> = ({
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
}) => {
  const [viewPassword, setViewPassword] = React.useState<boolean>(false);

  return (
    <Styled.wrapper>
      <Input
        id={id}
        data-test="component-input-password"
        type={viewPassword ? 'text' : 'password'}
        size={size}
        label={label}
        value={value}
        isDisabled={isDisabled}
        error={error}
        required={required}
        optional={optional}
        helperText={helperText}
        onChange={onChange}
      >
        <Styled.toggle onClick={() => setViewPassword(!viewPassword)} data-test="password-toggle">
          <Icon
            src={viewPassword ? Icons.Hide : Icons.Show}
            size={IconSize.medium}
            color={
              !isDisabled
                ? typeof error !== 'string'
                  ? color.theme.blueMid
                  : color.alert.red
                : color.base.grey
            }
          />
        </Styled.toggle>
      </Input>
    </Styled.wrapper>
  );
};

export default InputPassword;
