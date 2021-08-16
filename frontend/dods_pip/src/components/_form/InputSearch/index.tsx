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
  label = 'Search...',
  value,
  isDisabled = false,
  error,
  helperText,
  onChange,
}) => {
  return (
    <Styled.wrapper>
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
      <Input
        id={id}
        data-test="component-input-search"
        type="text"
        label={label}
        value={value}
        isDisabled={isDisabled}
        error={error}
        helperText={helperText}
        onChange={onChange}
      />
    </Styled.wrapper>
  );
};

export default InputSearch;
