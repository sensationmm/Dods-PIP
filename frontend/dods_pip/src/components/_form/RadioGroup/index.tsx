import React from 'react';

import Spacer from '../../_layout/Spacer';
import Label from '../Label';
import { Radio } from '../Radio';
import * as Styled from './RadioGroup.styles';

export interface IRadioGroupProps {
  name: string;
  onChange: (val: string) => void;
  value: string;
  label?: string;
  isDisabled?: boolean;
  required?: boolean;
  optional?: boolean;
  theme: 'dark' | 'light';
}

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
                isChecked={value === radioValue}
                isDisabled={isDisabled}
                onChange={onChange}
              />
            );
          })}
      </Styled.radioGroupWrapper>
    </Styled.radioGroup>
  );
};

export default RadioGroup;
