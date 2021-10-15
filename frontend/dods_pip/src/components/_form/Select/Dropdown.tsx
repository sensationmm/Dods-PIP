import React from 'react';

import color from '../../../globals/color';
import { inArray } from '../../../utils/array';
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
  selectedValue?: SelectProps['value'] | Array<SelectProps['value']>;
  setValue: (val: string) => void;
  isFilter?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  hasHelper,
  hasError,
  options,
  size = 'large',
  selectedValue = '',
  setValue,
  isFilter = false,
}) => {
  return (
    <Styled.dropdown
      data-test="component-dropdown"
      open={isOpen}
      hasHelper={hasHelper}
      hasError={hasError}
      isFilter={isFilter}
    >
      {options.map((item, count) => {
        const isActive =
          item.value === selectedValue ||
          (Array.isArray(selectedValue) && inArray(item.value, selectedValue));

        return (
          <Styled.dropdownItem
            key={`option-${count}`}
            data-test={`option-${count}`}
            size={size}
            onClick={() => {
              !isActive && setValue(item.value);
            }}
            hasError={hasError}
            tabIndex={2}
            onKeyPress={() => {
              !isActive && setValue(item.value);
            }}
            active={isActive}
            isFilter={isFilter}
          >
            {item.label}
            {isActive && (
              <Icon
                data-test="selected-icon"
                src={Icons.TickBold}
                size={IconSize.medium}
                color={hasError ? color.alert.red : color.theme.blueMid}
              />
            )}
          </Styled.dropdownItem>
        );
      })}
    </Styled.dropdown>
  );
};

export default Dropdown;
