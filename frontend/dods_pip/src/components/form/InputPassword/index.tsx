import React from 'react';

import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import color from '../../../globals/color';

import Input, { InputBaseProps } from '../InputBase';
import * as Styled from './InputPassword.styles';

export interface InputPasswordProps extends Omit<InputBaseProps, 'type'> {}

const InputPassword: React.FC<InputPasswordProps> = ({
  label,
  value,
  isDisabled = false,
  hasError,
  helperText,
  onChange,
}) => {
  const [viewPassword, setViewPassword] = React.useState<boolean>(false);

  return (
    <Styled.wrapper>
      <Input
        data-test="component-input-password"
        type={viewPassword ? 'text' : 'password'}
        label={label}
        value={value}
        isDisabled={isDisabled}
        hasError={hasError}
        helperText={helperText}
        onChange={(e) => onChange(e.target.value)}
      />
      <Styled.toggle onClick={() => setViewPassword(!viewPassword)} data-test="password-toggle">
        <Icon
          src={viewPassword ? Icons.IconHide : Icons.IconShow}
          size={IconSize.medium}
          color={
            !isDisabled ? (!hasError ? color.theme.blueMid : color.alert.red) : color.base.grey
          }
        />
      </Styled.toggle>
    </Styled.wrapper>
  );
};

export default InputPassword;
