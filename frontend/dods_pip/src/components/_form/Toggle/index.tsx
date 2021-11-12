import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import * as Styled from './Toggle.styles';

export interface ToggleProps {
  isActive?: boolean;
  isDisabled?: boolean;
  onChange: (val: boolean) => void;
  labelOff?: string;
  labelOn?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  isActive = false,
  isDisabled = false,
  onChange,
  labelOff,
  labelOn,
}) => {
  const Component = isActive ? Styled.toggleActive : Styled.toggle;

  const trigger = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Space') {
      event.preventDefault();
      onChange(!isActive);
    }
  };

  return (
    <Styled.wrapper data-test="component-toggle" onKeyDown={trigger} tabIndex={0}>
      {labelOff && (
        <Text
          type="body"
          color={
            isDisabled ? color.base.grey : !isActive ? color.theme.blueDark : color.base.greyDark
          }
          bold={!isActive}
        >
          <span onClick={() => onChange(false)}>{labelOff}</span>
        </Text>
      )}
      <Component
        data-test="toggle-control"
        className={classNames({ disabled: isDisabled })}
        onClick={() => (isDisabled ? null : onChange(!isActive))}
      >
        <Styled.control />
      </Component>

      {labelOn && (
        <Text
          type="body"
          color={
            isDisabled ? color.base.grey : isActive ? color.theme.blueDark : color.base.greyDark
          }
          bold={isActive}
        >
          <span onClick={() => onChange(true)}>{labelOn}</span>
        </Text>
      )}
    </Styled.wrapper>
  );
};

export default Toggle;
