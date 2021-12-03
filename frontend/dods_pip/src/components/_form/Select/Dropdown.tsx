import find from 'lodash/find';
import React from 'react';

import color from '../../../globals/color';
import { DropdownValue } from '../../../pages/account-management/add-client/type';
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
  selectedValue?: SelectProps['value'] | Array<SelectProps['value'] | DropdownValue>;
  setValue: (val: string, item?: DropdownValue) => void;
  isFilter?: boolean;
  testId?: string;
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
  testId,
}) => {
  return (
    <Styled.dropdown
      data-test="component-dropdown"
      data-testid={testId}
      open={isOpen}
      hasHelper={hasHelper}
      hasError={hasError}
      isFilter={isFilter}
    >
      {options.map((item, count) => {
        const isActive =
          item.value === selectedValue ||
          (Array.isArray(selectedValue) && inArray(item.value, selectedValue as string[])) ||
          (Array.isArray(selectedValue) && Boolean(find(selectedValue, ['value', item.value])));

        return (
          <Styled.dropdownItem
            key={`option-${count}`}
            data-test={`option-${count}`}
            size={size}
            onClick={() => {
              !isActive && setValue(item.value, item);
            }}
            hasError={hasError}
            tabIndex={2}
            onKeyPress={() => {
              !isActive && setValue(item.value, item);
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
