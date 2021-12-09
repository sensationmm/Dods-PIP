import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import color from '../../../globals/color';
import { DropdownValue } from '../../../pages/account-management/add-client/type';
import Text from '../../Text';
import InputSearch, { InputSearchProps } from '../InputSearch';
import { SelectProps } from '../Select';
import Dropdown from '../Select/Dropdown';
import * as Styled from './SearchDropdown.styles';

export interface SearchDropdownProps extends Omit<InputSearchProps, 'value'> {
  value?: InputSearchProps['value'];
  values: SelectProps['options'];
  selectedValues?: Array<string | DropdownValue>;
  onChange: (val: string, item?: DropdownValue) => void;
  onKeyPress?: (val: string, search?: string) => void;
  isFilter?: boolean;
  onKeyPressHasSearch?: boolean;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  onChange,
  onKeyPress,
  values,
  selectedValues = [],
  isFilter = false,
  value,
  placeholder,
  testId,
  isDisabled,
  onKeyPressHasSearch = false,
  ...rest
}) => {
  const [search, setSearch] = React.useState<string>('');
  const [results, setResults] = React.useState<SelectProps['options']>([]);

  const searchHandler = (val: string) => {
    if (typeof onKeyPress === 'function') {
      if (onKeyPressHasSearch) {
        onKeyPress('0000', val);
      } else {
        onKeyPress(val);
      }
    }

    setSearch(val);
    const res = values.filter(
      (item) => val !== '' && item.label.toLowerCase().indexOf(val.toLowerCase()) > -1,
    );
    setResults(res.slice(0, 5));
  };

  const handleChange = (val: string, item?: DropdownValue) => {
    onChange(val, item);
    reset();
  };

  const reset = () => {
    setSearch('');
    setResults([]);
  };

  return (
    <Styled.wrapper
      data-test="component-search-dropdown"
      onClick={() => isFilter && !results.length && !isDisabled && setResults(values)}
    >
      <OutsideClickHandler onOutsideClick={reset}>
        <InputSearch
          data-test="search-field"
          {...rest}
          testId={testId}
          value={search}
          onChange={searchHandler}
          placeholder={value ? '' : placeholder}
          error={search !== '' && results.length === 0 ? 'No results found!' : undefined}
          isDisabled={isDisabled}
        >
          {isFilter && value && !search && (
            <Styled.searchValue>
              <Text
                data-test="search-value"
                color={!isDisabled ? color.theme.blueMid : color.base.grey}
              >
                {values.find((val) => val.value === value)?.label}
              </Text>
            </Styled.searchValue>
          )}
        </InputSearch>

        <Dropdown
          data-test="results-dropdown"
          testId={testId + '-dropdown'}
          isOpen={results?.length > 0}
          hasHelper={rest.helperText !== undefined && rest.helperText !== ''}
          hasError={rest.error !== undefined}
          options={results}
          size={rest.size}
          selectedValue={selectedValues}
          setValue={handleChange}
        />
      </OutsideClickHandler>
    </Styled.wrapper>
  );
};

export default SearchDropdown;
