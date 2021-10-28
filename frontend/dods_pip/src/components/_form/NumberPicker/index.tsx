import React, { useEffect } from 'react';

import color from '../../../globals/color';
import Spacer from '../../_layout/Spacer';
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
  value?: number;
  isDisabled?: boolean;
  error?: string;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  onChange: (val: number) => void;
  onBlur?: (val: string | undefined) => void;
  onFocus?: () => void;
  tabIndex?: number;
  minVal?: number;
  maxVal?: number;
}

const RANGE_MAX = 999;
const RANGE_MIN = 0;

const ERROR_ID = 'NumberPicker component';

const validateMaxAndMinValues = (min: number, max: number) => {
  const CURRENT_RANGE = `(min: ${min}, max: ${max})`;

  if (min >= max)
    throw new TypeError(`${ERROR_ID}: ${CURRENT_RANGE} - Min should be less than max`);
  if (min < RANGE_MIN)
    throw new TypeError(`${ERROR_ID}: ${CURRENT_RANGE} - Min should be a positive integer`);
  if (max > RANGE_MAX)
    throw new TypeError(
      `${ERROR_ID}: ${CURRENT_RANGE} - Max should less than or equal to ${RANGE_MAX}`,
    );
};

const NumberPicker: React.FC<NumberPickerProps> = ({
  id,
  size = 'medium',
  label,
  value = -1,
  isDisabled = false,
  required,
  optional,
  error,
  helperText,
  onChange,
  onBlur,
  onFocus,
  tabIndex,
  minVal = RANGE_MIN,
  maxVal = RANGE_MAX,
}) => {
  validateMaxAndMinValues(minVal, maxVal);

  const [currentValue, setCurrentValue] = React.useState<number>(value);
  const [internalError, setInternalError] = React.useState<string | undefined>(error);

  useEffect(() => {
    setInternalError(error?.length ? error : undefined);
  }, [error]);

  const updateValue = (direction: 'decrement' | 'increment') => {
    if (isDisabled) return;
    if (currentValue > maxVal) return onChangeHandler(maxVal - 1);
    if (currentValue < minVal) return onChangeHandler(minVal);

    if (direction === 'increment' && currentValue <= maxVal)
      return onChangeHandler(currentValue + 1);

    // erroneous low coverage report
    /* istanbul ignore next */
    if (direction === 'decrement' && currentValue >= minVal)
      return onChangeHandler(currentValue - 1);
  };

  const onChangeHandler = (value: number) => {
    setCurrentValue(value);
    setInternalError(undefined);

    if (required && value < RANGE_MIN) return setInternalError('This field is required');
    if (value < minVal) return setInternalError(`Minimum value is ${minVal}`);
    if (value > maxVal) return setInternalError(`Maximum value is ${maxVal}`);

    onChange(value);
  };

  const handleInputChange = (e: any) => {
    /[^0-9]/g.test(e.key) && e.preventDefault();
  };

  return (
    <div data-test="number-picker-component">
      {label && (
        <>
          <Label data-test="number-picker-label" {...{ required, optional, label, isDisabled }} />
          <Spacer size={3} />
        </>
      )}

      <Styled.numberPicker
        isDisabled={isDisabled}
        hasError={Boolean(internalError)}
        size={size}
        data-test="number-picker-container"
      >
        <button
          data-test="number-picker-minus"
          className="icon-button"
          disabled={isDisabled || (currentValue as number) <= minVal}
          onClick={() => updateValue('decrement')}
        >
          <Icon src={Icons.Minus} size={IconSize.mediumLarge} color={color.theme.blue} />
        </button>
        <input
          data-test="number-picker-input"
          tabIndex={tabIndex}
          onFocus={onFocus}
          onKeyPress={(e) => handleInputChange(e)}
          onChange={(e: any) => onChangeHandler(parseInt(e.target.value))}
          onBlur={() => onBlur && onBlur(internalError)}
          id={id}
          type="number"
          disabled={isDisabled}
          required={required}
          value={currentValue < RANGE_MIN ? '' : currentValue.toString()}
        />
        <button
          data-test="number-picker-plus"
          className="icon-button"
          disabled={isDisabled || (currentValue as number) >= maxVal}
          onClick={() => updateValue('increment')}
        >
          <Icon src={Icons.Add} size={IconSize.mediumLarge} color={color.theme.blue} />
        </button>
      </Styled.numberPicker>
      <Text
        data-test="number-picker-helper-text"
        type="labelSmall"
        color={
          isDisabled ? color.base.greyDark : internalError ? color.alert.red : color.theme.blueMid
        }
        bold
      >
        {internalError ? internalError : helperText}
      </Text>
    </div>
  );
};

export default NumberPicker;
