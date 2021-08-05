import React from 'react';

import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import color from '../../../globals/color';

import Input, { InputBaseProps } from '../InputBase';
import * as Styled from './InputSearch.styles';

export interface InputSearchProps extends Omit<InputBaseProps, 'type' | 'label'> {
  label?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({
  label = 'Search...',
  value,
  isDisabled = false,
  hasError,
  helperText,
  onChange,
}) => {
  return (
    <Styled.wrapper>
      <Icon
        src={Icons.IconSearch}
        size={IconSize.medium}
        color={!isDisabled ? (!hasError ? color.theme.blueMid : color.alert.red) : color.base.grey}
      />
      <Input
        data-test="component-input-search"
        type="text"
        label={label}
        value={value}
        isDisabled={isDisabled}
        hasError={hasError}
        helperText={helperText}
        onChange={(e) => onChange(e.target.value)}
      />
    </Styled.wrapper>
  );
};

export default InputSearch;
