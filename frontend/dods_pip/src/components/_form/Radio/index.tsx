import React from 'react';

import * as Styled from './Radio.styles';

export interface IRadioProps extends IRadioItem {
  name: string;
  id: string;
  isChecked?: boolean;
  isDisabled?: boolean;
  theme: radioTheme;
  onChange: (val: string) => void;
}

export interface IRadioItem {
  label: string;
  value: string;
}

// Maybe could move higher up the tree for global use
export type radioTheme = 'dark' | 'light';

const Radio: React.FC<IRadioProps> = ({
  id,
  isChecked = false,
  isDisabled = false,
  theme = 'dark',
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <Styled.Radio data-test="component" htmlFor={id} theme={theme}>
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
      <span className="custom-radio" data-test="custom-radio" />
      <span className="custom-label" data-test="custom-label">
        {label}
      </span>
    </Styled.Radio>
  );
};

export default Radio;
