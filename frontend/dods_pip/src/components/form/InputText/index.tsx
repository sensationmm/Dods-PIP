import React from 'react';
import classNames from 'classnames';

import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Input, { InputBaseProps } from '../InputBase';
import * as Styled from './InputText.styles';
import color from '../../../globals/color';

export interface InputTextProps extends Omit<InputBaseProps, 'type'> {
  icon?: Icons;
}

const InputText: React.FC<InputTextProps> = ({
  id,
  label,
  value,
  isDisabled = false,
  error,
  helperText,
  onChange,
  icon,
}) => {
  return (
    <Styled.wrapper className={classNames({ icon: icon !== undefined })}>
      <Input
        id={id}
        data-test="component-input-text"
        type="text"
        label={label}
        value={value}
        isDisabled={isDisabled}
        error={error}
        helperText={helperText}
        onChange={(e) => onChange(e.target.value)}
      />
      {icon && (
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
      )}
    </Styled.wrapper>
  );
};

export default InputText;
