import React from 'react';

import { Icons } from '../../Icon/assets';
import InputText, { InputTextProps } from '../InputText';
import * as Styled from './Select.styles';

type SelectItem = {
  name: string;
  value: string;
};

export interface SelectProps extends InputTextProps {
  // selected?: string;
  options: SelectItem[];
  // placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  size = 'large',
  label,
  value,
  options,
  placeholder = 'Choose an option...',
  isDisabled = false,
  error,
  required,
  optional,
  helperText,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const setValue = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const parseValue = () => {
    const selectedOption = options.filter((item) => item.value === value)[0];
    return selectedOption?.name || '';
  };

  return (
    <Styled.wrapper data-test="component-select">
      <Styled.select>
        <InputText
          id={id}
          data-test="component-select-value"
          size={size}
          label={label}
          value={value !== '' ? parseValue() : placeholder}
          isDisabled={isDisabled}
          error={error}
          required={required}
          optional={optional}
          helperText={helperText}
          onChange={onChange}
          icon={isOpen ? Icons.IconChevronUp : Icons.IconChevronDown}
        >
          <Styled.dropdown open={isOpen}>
            {options.map((item, count) => (
              <Styled.dropdownItem
                key={`option-${count}`}
                size={size}
                onClick={() => setValue(item.value)}
              >
                {item.name}
              </Styled.dropdownItem>
            ))}
          </Styled.dropdown>
        </InputText>
        <Styled.selectTrigger onClick={() => setIsOpen(!isOpen)} />
      </Styled.select>
    </Styled.wrapper>
  );
};

export default Select;
