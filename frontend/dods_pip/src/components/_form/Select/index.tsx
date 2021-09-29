import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import InputText, { InputTextProps } from '../InputText';
import * as Styled from './Select.styles';

type SelectItem = {
  name: string;
  value: string;
};

export interface SelectProps extends Omit<InputTextProps, 'icon' | 'length'> {
  options: SelectItem[];
  isFullWidth?: boolean;
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
    return selectedOption?.name || '';
  };

  return (
    <Styled.wrapper data-test="component-select" isFullWidth={isFullWidth}>
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
            icon={isOpen && !isDisabled ? Icons.IconChevronUp : Icons.IconChevronDown}
            css={{ pointerEvents: 'none' }}
            onFocus={() => setIsOpen(true)}
            tabIndex={1}
            placeholder={placeholder}
            length={Math.max(...options.map((item) => item.name.length))}
          />
          {!isDisabled && (
            <Styled.selectTrigger data-test="select-trigger" onClick={() => setIsOpen(!isOpen)} />
          )}
          <Styled.dropdown
            data-test="select-dropdown"
            open={isOpen && !isDisabled}
            hasHelper={helperText !== undefined && helperText !== ''}
            hasError={error !== undefined}
          >
            {options.map((item, count) => (
              <Styled.dropdownItem
                key={`option-${count}`}
                data-test={`option-${count}`}
                size={size}
                onClick={() => setValue(item.value)}
                hasError={error !== undefined}
                tabIndex={2}
                onKeyPress={() => setValue(item.value)}
                active={item.value === value}
              >
                {item.name}
                {item.value === value && (
                  <Icon
                    data-test="selected-icon"
                    src={Icons.IconTickBold}
                    size={IconSize.medium}
                    color={error !== undefined ? color.alert.red : color.theme.blueMid}
                  />
                )}
              </Styled.dropdownItem>
            ))}
          </Styled.dropdown>
        </Styled.select>
      </OutsideClickHandler>
    </Styled.wrapper>
  );
};

export default Select;
