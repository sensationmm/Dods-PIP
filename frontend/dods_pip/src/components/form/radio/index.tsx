import classNames from 'classnames';
import React from 'react';

import Text from '../../Text';

import * as Styled from './Radio.styles';

export enum RadioType {
  Default,
  Button,
}

export interface IRadioProps extends IRadioConfig {
  name: string;
  id: string;
  isChecked?: boolean;
  isDisabled?: boolean;
  onChange: (val: any) => void;
}

interface IRadioConfig {
  label: string;
  value: string;
}

export interface IRadioGroupProps {
  items: IRadioConfig[];
  name: string;
  handleChange: (event: any) => void;
  selectedValue: string;
  groupLabel?: string;
  isDisabled?: boolean;
  type?: RadioType;
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
        onChange={onChange}
        type="radio"
        value={value}
        checked={isChecked}
        className={classNames({ disabled: isDisabled })}
      />
      <Text htmlFor={id} type={'label'}>
        {label}
      </Text>
    </Styled.radio>
  );
};

// const RadioGroup: React.FC<IRadioGroupProps> = ({
//   items,
//   name,
//   handleChange,
//   selectedValue,
//   groupLabel,
//   type = RadioType.Default,
//   isDisabled = false,
// }) => {
//   const radioValue = selectedValue;

//   return (
//     <fieldset
//       className={classNames(Styled.radioGroup, { [Styled.button]: type === RadioType.Button })}
//       data-test="component-radio-group"
//     >
//       <Text element="legend" type={TextStyles.label}>
//         {groupLabel}
//       </Text>

//       <div className={Styled.radioGroupWrapper}>
//         {items &&
//           items.map((item, i) => {
//             const { label, value } = item;
//             const id = `${name}-${i}`;

//             return (
//               <Radio
//                 id={id}
//                 key={i}
//                 label={label}
//                 value={value}
//                 name={name}
//                 isChecked={value === radioValue ? true : false}
//                 isDisabled={isDisabled}
//                 onChange={(e) => {
//                   let updatedValue = e.target.value;

//                   if (updatedValue === 'false') {
//                     updatedValue = false;
//                   } else if (updatedValue === 'true') {
//                     updatedValue = true;
//                   }

//                   handleChange(updatedValue);
//                 }}
//               />
//             );
//           })}
//       </div>
//     </fieldset>
//   );
// };

export { Radio };

// export default RadioGroup;
