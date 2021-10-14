import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import color from '../../../globals/color';
import { inArray } from '../../../utils/array';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';
import InputText, { InputTextProps } from '../InputText';
import * as Styled from './SelectMulti.styles';

type SelectItem = {
  label: string;
  value: string;
};

export interface SelectMultiProps extends Omit<InputTextProps, 'icon' | 'value' | 'onChange'> {
  value: Array<string>;
  options: SelectItem[];
  onChange: (val: Array<string>) => void;
  isFullWidth?: boolean;
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
    if (inArray(val, value)) {
      const vals = value.slice();
      const index = value.indexOf(val);
      vals.splice(index, 1);
      onChange(vals);
    } else {
      onChange([...value, val]);
    }
  };

  const numSelected = value.filter((item) =>
    inArray(item, options.map((item) => item.value) as Array<string>),
  ).length;
  const hasSelected = numSelected > 0;

  return (
    <Styled.wrapper
      data-test="component-select"
      hasSelected={hasSelected}
      hasError={error !== undefined}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
    >
      <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
        <Styled.select>
          <InputText
            id={id}
            data-test="select-input"
            size={size}
            label={label}
            value={
              hasSelected ? (numSelected === 1 ? 'Item selected' : 'Items selected') : placeholder
            }
            isDisabled={isDisabled}
            error={error}
            required={required}
            optional={optional}
            helperText={helperText}
            onChange={() => setIsOpen(true)}
            icon={isOpen && !isDisabled ? Icons.ChevronUp : Icons.ChevronDown}
            css={{ pointerEvents: 'none' }}
            onFocus={() => setIsOpen(true)}
            tabIndex={1}
            placeholder={placeholder}
            length={Math.max(...options.map((item) => item.label.length))}
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
                      <Icon src={Icons.Tick} size={IconSize.small} color={color.base.white} />
                    )}
                  </Component>
                  {item.label}
                </Styled.dropdownItem>
              );
            })}
          </Styled.dropdown>
        </Styled.select>
      </OutsideClickHandler>
    </Styled.wrapper>
  );
};

export default SelectMulti;
