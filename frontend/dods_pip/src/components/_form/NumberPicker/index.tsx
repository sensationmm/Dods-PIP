import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import { validateNumeric } from '../../../utils/validation';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';
import Label from '../Label';
import * as Styled from './NumberPicker.styles';

export type InputSize = 'small' | 'medium' | 'large';

export interface NumberPickerProps {
  id?: string;
  size?: InputSize;
  label?: string;
  value: string;
  isDisabled?: boolean;
  error?: string | undefined;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  onChange: (val: string) => void;
  onFocus?: () => void;
  onBlur?: (val?: string) => void;
  placeholder?: string;
  tabIndex?: number;
  minVal?: string;
  maxVal?: string;
}

const NumberPicker: React.FC<NumberPickerProps> = ({
  id,
  size = 'medium',
  label,
  value,
  placeholder,
  isDisabled = false,
  required,
  optional,
  error,
  helperText,
  onChange,
  onFocus,
  onBlur,
  tabIndex,
  minVal = '0',
  maxVal = '999',
}) => {
  const [hoverPlusButton, setHoverPlusButton] = React.useState(false);
  const [hoverMinusButton, setHoverMinusButton] = React.useState(false);
  const valueConverter = (value: string) => value.substr(0, 3);
  value = valueConverter(value);
  const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    if (validateNumeric(parseInt(e.target.value))) {
      if (
        parseInt(e.target.value) < parseInt(minVal) ||
        parseInt(e.target.value) > parseInt(maxVal)
      ) {
        parseInt(minVal) > -1 &&
          parseInt(maxVal) <= 999 &&
          onBlur?.(`Must be in range ${minVal}-${maxVal}`);
        parseInt(minVal) > 0 && maxVal === '999' && onBlur?.(`Minimum value is ${minVal}`);
        minVal === '0' && parseInt(maxVal) < 999 && onBlur?.(`Maximum value is ${maxVal}`);
      } else {
        onBlur?.(undefined);
      }
    } else {
      onBlur?.('This field is required');
    }
  };

  return (
    <div data-test="number-input-component">
      {label && (
        <Styled.labelWrapper>
          <Label required={required} optional={optional} label={label} />
        </Styled.labelWrapper>
      )}
      <Styled.InputArea disabled={isDisabled} error={error} size={size}>
        <Styled.iconWrapper
          size={size}
          disabled={isDisabled || parseInt(value) <= parseInt(minVal)}
          error={error}
          onClick={() => {
            if (parseInt(value) > parseInt(minVal)) {
              onChange((parseInt(valueConverter(value)) - 1).toString());
            }
            if (parseInt(value) - 1 <= parseInt(maxVal)) {
              onBlur?.(undefined);
            }
          }}
          onMouseEnter={() => setHoverMinusButton(true)}
          onMouseLeave={() => setHoverMinusButton(false)}
          data-test="minus-button"
        >
          <Icon
            src={Icons.IconMinus}
            size={IconSize.large}
            data-test="minus-icon"
            color={
              isDisabled
                ? color.base.greyDark
                : typeof error === 'string'
                ? color.base.white
                : !hoverMinusButton
                ? color.base.grey
                : color.theme.blue
            }
          />
        </Styled.iconWrapper>
        <Styled.inputWrapper>
          <Styled.input
            tabIndex={tabIndex}
            onBlur={onBlurHandler}
            onFocus={onFocus}
            onChange={(e) => onChange(e.target.value)}
            id={id}
            type="number"
            className={classNames({
              error: typeof error === 'string',
              disabled: isDisabled,
              small: size === 'small',
              medium: size === 'medium',
            })}
            data-test="component-input-number"
            value={validateNumeric(parseInt(value)) ? value : ''}
            placeholder={placeholder}
            disabled={isDisabled}
            required={required}
          ></Styled.input>
        </Styled.inputWrapper>
        <Styled.iconWrapper
          size={size}
          disabled={isDisabled || parseInt(value) >= parseInt(maxVal)}
          error={error}
          onClick={() => {
            if (parseInt(value) < parseInt(maxVal)) {
              onChange((parseInt(value) + 1).toString());
            }
            if (parseInt(value) + 1 >= parseInt(minVal)) {
              onBlur?.(undefined);
            }
          }}
          onMouseEnter={() => setHoverPlusButton(true)}
          onMouseLeave={() => setHoverPlusButton(false)}
          data-test="plus-button"
        >
          <Icon
            src={Icons.IconAdd}
            size={IconSize.large}
            data-test="plus-icon"
            color={
              isDisabled
                ? color.base.greyDark
                : typeof error === 'string'
                ? color.base.white
                : !hoverPlusButton
                ? color.base.grey
                : color.theme.blue
            }
          />
        </Styled.iconWrapper>
      </Styled.InputArea>

      {(helperText || typeof error === 'string') && (
        <Text
          data-test="component-input-base-helper"
          type={'span'}
          color={
            isDisabled
              ? color.base.grey
              : typeof error === 'string'
              ? color.alert.red
              : color.theme.blueMid
          }
          bold
        >
          {typeof error !== 'string' ? helperText : error}
        </Text>
      )}
    </div>
  );
};

export default NumberPicker;
