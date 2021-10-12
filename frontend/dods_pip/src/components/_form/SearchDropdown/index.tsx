import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import InputSearch, { InputSearchProps } from '../InputSearch';
import { SelectProps } from '../Select';
import Dropdown from '../Select/Dropdown';
import * as Styled from './SearchDropdown.styles';

export interface SearchDropdownProps extends Omit<InputSearchProps, 'value'> {
  values: SelectProps['options'];
  selectedValues?: Array<string>;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  onChange,
  values,
  selectedValues = [],
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
    <Styled.wrapper data-test="component-search-dropdown">
      <OutsideClickHandler onOutsideClick={reset}>
        <InputSearch data-test="search-field" {...rest} value={search} onChange={searchHandler} />

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
