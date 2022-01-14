import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Icon, { IconSize } from '../../Icon';
import { Icons } from '../../Icon/assets';
import Label, { LabelProps } from '../Label';
import * as Styled from './Checkbox.styles';

export interface CheckboxProps extends Omit<LabelProps, 'label'> {
  label?: LabelProps['label'];
  id: string;
  isChecked: boolean;
  onChange: (value: boolean) => void;
  isDisabled?: boolean;
  darkMode?: boolean;
  hint?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  isChecked,
  onChange,
  isDisabled = false,
  required,
  optional,
  bold,
  darkMode,
  hint,
}) => {
  const Component = isChecked ? Styled.checkboxToggleChecked : Styled.checkboxToggle;

  const trigger = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Space') {
      event.preventDefault();
      onChange(!isChecked);
    }
  };

  return (
    <Styled.checkbox data-test="component-checkbox" id={id} disabled={isDisabled}>
      <Styled.checkboxLayout
        data-test="component-checkbox-layout"
        onClick={() => (isDisabled ? null : onChange(!isChecked))}
        role="checkbox"
        aria-checked={isChecked}
      >
        <Component
          darkMode={darkMode}
          data-test="component-checkbox-toggle"
          className={classNames({ disabled: isDisabled })}
          tabIndex={0}
          onKeyDown={trigger}
        >
          {isChecked && (
            <Icon
              src={Icons.Tick}
              size={IconSize.medium}
              data-test="component-icon"
              color={darkMode ? color.theme.blueDark : color.base.white}
            />
          )}
        </Component>
        {label && (
          <Styled.checkboxLabelWrapper>
            <Label
              darkMode={darkMode}
              label={label}
              required={required}
              optional={optional}
              isDisabled={isDisabled}
              noMargin
              bold={bold}
              parenthetical={hint}
            />
          </Styled.checkboxLabelWrapper>
        )}
      </Styled.checkboxLayout>
    </Styled.checkbox>
  );
};

export default Checkbox;
