import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Spacer from '../../_layout/Spacer';
import Text from '../../Text';
import Label from '../Label';
import * as Styled from './Radio.styles';

export interface IRadioProps extends IRadioConfig {
  name: string;
  id: string;
  isChecked?: boolean;
  isDisabled?: boolean;
  onChange: (val: string) => void;
}

interface IRadioConfig {
  label: string;
  value: string;
}

export interface IRadioGroupProps {
  items: IRadioConfig[];
  name: string;
  onChange: (val: string) => void;
  value: string;
  label?: string;
  isDisabled?: boolean;
  required?: boolean;
  optional?: boolean;
}

const Radio: React.FC<IRadioProps> = ({
  id,
  isChecked = false,
  isDisabled,
  label,
  name,
  value,
  onChange,
}) => {
  const Component = !isDisabled ? Styled.radioInput : Styled.radioInputDisabled;
  return (
    <Styled.radio data-test="component-radio">
      <Component
        data-test="radio-input"
        id={id}
        name={name}
        onChange={() => onChange(value)}
        type="radio"
        value={value}
        checked={isChecked}
        className={classNames({ disabled: isDisabled })}
      />
      <Text
        htmlFor={id}
        type={'label'}
        color={!isDisabled ? color.theme.blue : color.base.greyDark}
      >
        {label}
      </Text>
    </Styled.radio>
  );
};

const RadioGroup: React.FC<IRadioGroupProps> = ({
  items,
  name,
  onChange,
  value,
  label,
  isDisabled = false,
  required = false,
  optional = false,
}) => {
  const radioValue = value;

  return (
    <Styled.radioGroup data-test="component-radio-group">
      {label && (
        <Label
          data-test="radio-group-label"
          label={label}
          required={required}
          optional={optional}
        />
      )}

      <Spacer size={3} />

      <Styled.radioGroupWrapper>
        {items &&
          items.map((item, i) => {
            const { label, value } = item;
            const id = `${name}-${i}`;

            return (
              <Radio
                id={id}
                key={i}
                label={label}
                value={value}
                name={name}
                isChecked={value === radioValue ? true : false}
                isDisabled={isDisabled}
                onChange={onChange}
              />
            );
          })}
      </Styled.radioGroupWrapper>
    </Styled.radioGroup>
  );
};

export { Radio };

export default RadioGroup;
