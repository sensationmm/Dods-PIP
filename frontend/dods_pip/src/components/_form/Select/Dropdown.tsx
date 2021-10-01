import React from 'react';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import { SelectProps } from '.';
import * as Styled from './Select.styles';

export interface DropdownProps {
  isOpen: boolean;
  hasHelper: boolean;
  hasError: boolean;
  options: SelectProps['options'];
  size?: SelectProps['size'];
  selectedValue?: SelectProps['value'];
  setValue: (val: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  hasHelper,
  hasError,
  options,
  size = 'large',
  selectedValue = '',
  setValue,
}) => {
  return (
    <Styled.dropdown
      data-test="component-dropdown"
      open={isOpen}
      hasHelper={hasHelper}
      hasError={hasError}
    >
      {options.map((item, count) => (
        <Styled.dropdownItem
          key={`option-${count}`}
          data-test={`option-${count}`}
          size={size}
          onClick={() => setValue(item.value)}
          hasError={hasError}
          tabIndex={2}
          onKeyPress={() => setValue(item.value)}
          active={item.value === selectedValue}
        >
          {item.label}
          {item.value === selectedValue && (
            <Icon
              data-test="selected-icon"
              src={Icons.IconTickBold}
              size={IconSize.medium}
              color={hasError ? color.alert.red : color.theme.blueMid}
            />
          )}
        </Styled.dropdownItem>
      ))}
    </Styled.dropdown>
  );
};

export default Dropdown;
