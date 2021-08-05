import React from 'react';
import classNames from 'classnames';

import * as Styled from './Toggle.styles';
import Icon from '../../Icon';
import { Icons } from '../../Icon/assets';
import color from '../../../globals/color';

export interface ToggleProps {
  isActive?: boolean;
  isDisabled?: boolean;
  onChange: (val: any) => void;
}

const Toggle: React.FC<ToggleProps> = ({ isActive = false, isDisabled = false, onChange }) => {
  const Component = isActive ? Styled.toggleActive : Styled.toggle;

  const trigger = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Space') {
      event.preventDefault();
      onChange(!isActive);
    }
  };

  return (
    <Styled.wrapper
      data-test="component-toggle"
      onKeyDown={trigger}
      onClick={() => (isDisabled ? null : onChange(!isActive))}
      tabIndex={0}
    >
      <Component className={classNames({ disabled: isDisabled })}>
        <Styled.control>
          <Icon
            src={isActive ? Icons.IconTickBold : Icons.IconCross}
            color={isActive ? color.theme.blueMid : color.base.grey}
          />
        </Styled.control>
      </Component>
    </Styled.wrapper>
  );
};

export default Toggle;
