import React from 'react';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Input, { InputBaseProps } from '../InputBase';
import * as Styled from './InputPassword.styles';

export interface InputPasswordProps extends Omit<InputBaseProps, 'type'> {}

const InputPassword: React.FC<InputPasswordProps> = ({
  id,
  label,
  value,
  isDisabled = false,
  error,
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
        label={label}
        value={value}
        isDisabled={isDisabled}
        error={error}
        helperText={helperText}
        onChange={onChange}
      />
      <Styled.toggle onClick={() => setViewPassword(!viewPassword)} data-test="password-toggle">
        <Icon
          src={viewPassword ? Icons.IconHide : Icons.IconShow}
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
    </Styled.wrapper>
  );
};

export default InputPassword;
