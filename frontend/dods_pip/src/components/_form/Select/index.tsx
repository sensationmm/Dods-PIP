import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import { Icons } from '../../Icon/assets';
import InputText, { InputTextProps } from '../InputText';
import Dropdown from './Dropdown';
import * as Styled from './Select.styles';

type SelectItem = {
  label: string;
  value: string;
};

export interface SelectProps extends Omit<InputTextProps, 'icon' | 'length'> {
  options: SelectItem[];
  isFullWidth?: boolean;
  isFilter?: boolean;
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
  onBlur,
  isFullWidth = false,
  isFilter = false,
  testId,
}) => {
  const firstRun = React.useRef(true);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (!firstRun.current && !isOpen) {
      onBlur && onBlur();
    }
  }, [isOpen]);

  const setValue = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const parseValue = () => {
    const selectedOption = options.filter((item) => item.value === value)[0];
    return selectedOption?.label || '';
  };

  return (
    <Styled.wrapper
      data-testid={testId}
      data-test="component-select"
      hasError={error !== undefined}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      isFilter={isFilter}
    >
      <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
        <Styled.select>
          <InputText
            id={id}
            data-test="select-input"
            size={size}
            label={label}
            value={value !== '' ? parseValue() : placeholder}
            isDisabled={isDisabled}
            error={error}
            required={required}
            optional={optional}
            helperText={helperText}
            onChange={() => setIsOpen(true)}
            icon={isOpen && !isDisabled ? Icons.ChevronUpBold : Icons.ChevronDownBold}
            css={{ pointerEvents: 'none' }}
            onFocus={() => setIsOpen(true)}
            tabIndex={1}
            placeholder={placeholder}
            length={Math.max(...options.map((item) => item.label?.length))}
          />
          {!isDisabled && (
            <Styled.selectTrigger data-test="select-trigger" onClick={() => setIsOpen(!isOpen)} />
          )}
          <Dropdown
            data-test="select-dropdown"
            isOpen={isOpen && !isDisabled}
            hasHelper={helperText !== undefined && helperText !== ''}
            hasError={error !== undefined}
            options={options}
            size={size}
            selectedValue={value}
            setValue={setValue}
            isFilter={isFilter}
          />
        </Styled.select>
      </OutsideClickHandler>
    </Styled.wrapper>
  );
};

export default Select;
