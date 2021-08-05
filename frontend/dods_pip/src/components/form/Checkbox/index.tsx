import React from 'react';
import classNames from 'classnames';
import color from '../../../globals/color';

import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';

import * as Styled from './Checkbox.styles';

export interface CheckboxProps {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: (value: boolean) => void;
  isDisabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, isChecked, onChange, isDisabled }) => {
  const Component = isChecked ? Styled.checkboxToggleChecked : Styled.checkboxToggle;

  const trigger = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Space') {
      event.preventDefault();
      onChange(!isChecked);
    }
  };

  return (
    <Styled.checkbox data-test="component-checkbox">
      <Styled.checkboxLayout
        data-test="component-checkbox-layout"
        onClick={() => (isDisabled ? null : onChange(!isChecked))}
        role="checkbox"
        aria-checked={isChecked}
      >
        <Component
          data-test="component-checkbox-toggle"
          className={classNames({ disabled: isDisabled })}
          tabIndex={0}
          onKeyDown={trigger}
        >
          {isChecked && (
            <Icon src={Icons.IconTick} size={IconSize.medium} color={color.base.white} />
          )}
        </Component>
        <Styled.checkboxLabel htmlFor={id} className={classNames({ disabled: isDisabled })}>
          <Text type="span" color={color.theme.blueMid} bold>
            {label}
          </Text>
        </Styled.checkboxLabel>
      </Styled.checkboxLayout>
    </Styled.checkbox>
  );
};

export default Checkbox;
