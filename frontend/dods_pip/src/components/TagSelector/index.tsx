import filter from 'lodash/filter';
import find from 'lodash/find';
import React from 'react';

import color from '../../globals/color';
import { DropdownValue } from '../../pages/account-management/add-client/type';
import { inArray } from '../../utils/array';
import SearchDropdown, { SearchDropdownProps } from '../_form/SearchDropdown';
import Spacer from '../_layout/Spacer';
import { UserType } from '../Avatar';
import Chips from '../Chips';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './TagSelector.styles';

export interface TagSelectorProps extends Omit<SearchDropdownProps, 'onChange'> {
  title: string;
  emptyMessage?: string;
  onChange: (vals: Array<string | DropdownValue>) => void;
  onKeyPress?: (val: string) => void;
  icon?: UserType | Icons;
  isQuery?: boolean;
  isFilter?: SearchDropdownProps['isDisabled'];
}

const TagSelector: React.FC<TagSelectorProps> = ({
  title,
  emptyMessage = 'No tag added',
  helperText,
  placeholder,
  values,
  size,
  onChange,
  onKeyPress,
  selectedValues = [],
  icon,
  error,
  isQuery = false,
  isFilter = false,
}) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const handleRemove = (val: string) => {
    // remove val from selectedValues
    let newValues;
    const firstItem = selectedValues[0];

    if (typeof firstItem === 'string') {
      newValues = filter(selectedValues as string[], function (data) {
        return data !== val;
      });
    } else {
      newValues = filter(selectedValues as DropdownValue[], function (data) {
        return data.value !== val;
      });
    }

    onChange(newValues);
  };

  const handleAdd = (val: string, item?: DropdownValue) => {
    // add val or item to selectedValues if not found
    let newValues;

    if (item && item.value) {
      newValues = selectedValues.slice() as DropdownValue[];
      const found = Boolean(find(selectedValues, ['value', item.value]));
      if (!found) {
        // add
        newValues.push(item);
      }
      onChange(newValues as DropdownValue[]);
    } else {
      newValues = selectedValues.slice() as string[];
      if (!inArray(val, newValues)) {
        // add
        newValues.push(val);
      }
      onChange(newValues as string[]);
    }
  };

  return (
    <Styled.wrapper data-test="component-tag-selector">
      <Styled.containerHeader>
        <Styled.containerHeaderTitle>
          <Text type={!isQuery ? 'h3' : 'body'} headingStyle="titleSmall">
            {title}:
          </Text>
        </Styled.containerHeaderTitle>
        {selectedValues.length === 0 && (
          <Styled.containerHeaderEmpty>
            <Text type="body" color={color.base.grey}>
              {emptyMessage}
            </Text>
          </Styled.containerHeaderEmpty>
        )}
        <Styled.tags>
          {selectedValues.map((item, count) => {
            item = item as DropdownValue;
            const key = typeof item === 'string' ? `chip-${count}` : `chip-${item.value}`;
            const label = typeof item === 'string' ? item : item.label;
            const value = typeof item === 'string' ? '' : item.value;
            return (
              <Chips
                data-test="chips"
                key={key}
                label={label}
                value={value}
                onCloseClick={handleRemove}
                avatarType={(item.icon || icon) as UserType}
                theme="dark"
              />
            );
          })}
        </Styled.tags>
      </Styled.containerHeader>

      <Spacer size={1} />

      <Styled.container focused={isFocused} isQuery={isQuery}>
        <SearchDropdown
          id="search-team-member"
          onChange={handleAdd}
          onKeyPress={onKeyPress}
          helperText={helperText}
          size={size}
          placeholder={placeholder}
          values={values}
          selectedValues={selectedValues}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          error={error}
          isFilter={isFilter}
        />
      </Styled.container>
    </Styled.wrapper>
  );
};

export default TagSelector;
