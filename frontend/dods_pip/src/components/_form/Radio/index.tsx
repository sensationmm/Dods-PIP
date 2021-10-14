import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import * as Styled from './Radio.styles';

export interface IRadioProps extends IRadioItem {
  name: string;
  id: string;
  isChecked?: boolean;
  isDisabled?: boolean;
  onChange: (val: string) => void;
}

export interface IRadioItem {
  label: string;
  value: string;
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
  return (
    <Styled.radio data-test="component-radio" htmlFor={id}>
      <input
        data-test="radio-input"
        id={id}
        name={name}
        onChange={() => onChange(value)}
        type="radio"
        value={value}
        {...(isDisabled && { disabled: true })}
        {...(isChecked && { checked: true })}
      />
      <span className="radio-button" />
      <span className="label">{label}</span>
    </Styled.radio>
  );
};

export default Radio;
