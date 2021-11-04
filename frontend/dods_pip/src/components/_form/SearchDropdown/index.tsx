import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import Text from '../../Text';
import InputSearch, { InputSearchProps } from '../InputSearch';
import { SelectProps } from '../Select';
import Dropdown from '../Select/Dropdown';
import * as Styled from './SearchDropdown.styles';

export interface SearchDropdownProps extends Omit<InputSearchProps, 'value'> {
  value?: InputSearchProps['value'];
  values: SelectProps['options'];
  selectedValues?: Array<string>;
  isFilter?: boolean;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  onChange,
  values,
  selectedValues = [],
  isFilter = false,
  value,
  placeholder,
  ...rest
}) => {
  const [search, setSearch] = React.useState<string>('');
  const [results, setResults] = React.useState<SelectProps['options']>([]);

  const searchHandler = (val: string) => {
    setSearch(val);
    const res = values.filter(
      (item) => val !== '' && item.label.toLowerCase().indexOf(val.toLowerCase()) > -1,
    );
    setResults(res.slice(0, 5));
  };

  const handleChange = (val: string) => {
    onChange(val);
    reset();
  };

  const reset = () => {
    setSearch('');
    setResults([]);
  };

  return (
    <Styled.wrapper
      data-test="component-search-dropdown"
      onClick={() => isFilter && !results.length && setResults(values)}
    >
      <OutsideClickHandler onOutsideClick={reset}>
        <InputSearch
          data-test="search-field"
          {...rest}
          value={search}
          onChange={searchHandler}
          placeholder={value ? '' : placeholder}
        >
          {isFilter && value && !search && (
            <Styled.searchValue>
              <Text data-test="search-value">
                {values.find((val) => val.value === value)?.label}
              </Text>
            </Styled.searchValue>
          )}
        </InputSearch>

        <Dropdown
          data-test="results-dropdown"
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
