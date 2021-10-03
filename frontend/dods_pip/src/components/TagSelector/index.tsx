import React from 'react';

import color from '../../globals/color';
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
  emptyMessage: string;
  onChange: (vals: Array<string>) => void;
  icon: UserType | Icons;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  title,
  emptyMessage,
  helperText,
  placeholder,
  values,
  size,
  onChange,
  selectedValues = [],
  icon,
}) => {
  const [deleteTag, setDeleteTag] = React.useState<string>('');
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const handleAdd = (val: string) => {
    const newValues = selectedValues.slice();
    if (!inArray(val, newValues)) {
      newValues.push(val);
    } else {
      newValues.splice(newValues.indexOf(val), 1);
      setDeleteTag('');
    }
    onChange(newValues);
  };

  return (
    <Styled.wrapper data-test="component-tag-selector">
      <Styled.containerHeader>
        <Styled.containerHeaderTitle>
          <Text type="h3" headingStyle="titleSmall">
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
          {selectedValues.map((item, count) => (
            <Chips
              key={`chip-${count}`}
              label={item}
              onCloseClick={handleAdd}
              avatarType={icon as UserType}
              onClick={() => setDeleteTag(item)}
              selected={item === deleteTag}
            />
          ))}
        </Styled.tags>
      </Styled.containerHeader>

      <Spacer size={1} />

      <Styled.container focused={isFocused}>
        <SearchDropdown
          id="search-team-member"
          onChange={handleAdd}
          helperText={helperText}
          size={size}
          placeholder={placeholder}
          values={values}
          selectedValues={selectedValues}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Styled.container>
    </Styled.wrapper>
  );
};

export default TagSelector;
