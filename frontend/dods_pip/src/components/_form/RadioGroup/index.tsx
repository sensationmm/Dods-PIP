import React from 'react';

import Spacer from '../../_layout/Spacer';
import Label, { LabelProps } from '../Label';
import Radio, { IRadioItem, radioTheme } from '../Radio';
import * as Styled from './RadioGroup.styles';

export interface IRadioGroupProps extends LabelProps {
  items: IRadioItem[];
  groupName?: string;
  onChange: (val: string) => void;
  theme?: radioTheme;
  selectedValue?: string;
  isDisabled?: boolean;
  stackItems?: boolean;
}

const RadioGroup: React.FC<IRadioGroupProps> = ({
  items,
  groupName = `group_${+new Date()}`,
  theme = 'dark',
  onChange,
  label,
  selectedValue,
  isDisabled = false,
  required = false,
  optional = false,
  stackItems = false,
}) => {
  const darkMode = theme === 'light';

  return (
    <Styled.radioGroup data-test="component-radio-group">
      {label && (
        <>
          <Label data-test="radio-group-label" {...{ label, required, optional, darkMode }} />
          <Spacer size={3} />
        </>
      )}

      <Styled.radioGroupWrapper data-test="radio-group-items" stacked={stackItems}>
        {items?.map((item, i) => {
          const { label, value } = item;
          const isChecked = selectedValue === value;

          return (
            <Radio
              key={`${groupName}-${i}`}
              {...{ theme, label, value, name: groupName, isDisabled, isChecked, onChange }}
            />
          );
        })}
      </Styled.radioGroupWrapper>
    </Styled.radioGroup>
  );
};

export default RadioGroup;
