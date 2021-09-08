import React from 'react';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Input, { InputBaseProps } from '../InputBase';
import * as Styled from './InputSearch.styles';

export interface InputSearchProps extends Omit<InputBaseProps, 'type' | 'label'> {
  label?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({
  id,
  size,
  label = 'Search...',
  value,
  isDisabled = false,
  error,
  required,
  optional,
  helperText,
  onChange,
}) => {
  return (
    <Styled.wrapper>
      <Input
        id={id}
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
        onChange={onChange}
      >
        <Icon
          src={Icons.IconSearch}
          size={IconSize.medium}
          color={
            !isDisabled
              ? typeof error !== 'string'
                ? color.theme.blueMid
                : color.alert.red
              : color.base.grey
          }
        />
      </Input>
    </Styled.wrapper>
  );
};

export default InputSearch;
