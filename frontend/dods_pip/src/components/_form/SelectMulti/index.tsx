import React from 'react';

import color from '../../../globals/color';
import { inArray } from '../../../utils/array';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';
import InputText, { InputTextProps } from '../InputText';
import * as Styled from './SelectMulti.styles';

type SelectItem = {
  name: string;
  value: string;
};

export interface SelectMultiProps extends Omit<InputTextProps, 'icon' | 'value' | 'onChange'> {
  value: Array<string>;
  options: SelectItem[];
  onChange: (val: Array<string>) => void;
}

const SelectMulti: React.FC<SelectMultiProps> = ({
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
    onChange([...value, val]);
    setIsOpen(false);
  };

  const numSelected = value.filter((item) =>
    inArray(item, options.map((item) => item.value) as Array<string>),
  ).length;
  const hasSelected = numSelected > 0;

  return (
    <Styled.wrapper data-test="component-select" hasSelected={hasSelected}>
      <Styled.select>
        <InputText
          id={id}
          data-test="select-input"
          size={size}
          label={label}
          value={hasSelected ? 'Items selected' : placeholder}
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
        >
          {hasSelected && (
            <Styled.pip data-test="selected-count">
              <Text bold type="span">
                {numSelected}
              </Text>
            </Styled.pip>
          )}
        </InputText>
        {!isDisabled && (
          <Styled.selectTrigger data-test="select-trigger" onClick={() => setIsOpen(!isOpen)} />
        )}
        <Styled.dropdown
          data-test="select-dropdown"
          open={isOpen && !isDisabled}
          hasHelper={helperText !== undefined && helperText !== ''}
          hasError={error !== undefined}
        >
          {options.map((item, count) => {
            const Component = inArray(item.value, value)
              ? Styled.checkboxToggleChecked
              : Styled.checkboxToggle;
            return (
              <Styled.dropdownItem
                key={`option-${count}`}
                data-test={`option-${count}`}
                size={size}
                onClick={() => setValue(item.value)}
                hasError={error !== undefined}
                tabIndex={2}
                onKeyPress={() => setValue(item.value)}
                active={inArray(item.value, value)}
              >
                <Component data-test="component-checkbox-toggle" hasError={error !== undefined}>
                  {inArray(item.value, value) && (
                    <Icon src={Icons.IconTick} size={IconSize.small} color={color.base.white} />
                  )}
                </Component>
                {item.name}
              </Styled.dropdownItem>
            );
          })}
        </Styled.dropdown>
      </Styled.select>
    </Styled.wrapper>
  );
};

export default SelectMulti;
