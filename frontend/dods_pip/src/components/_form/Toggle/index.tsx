import Spacer from '@dods-ui/components/_layout/Spacer';
import classNames from 'classnames';
import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import Label from '../Label';
import * as Styled from './Toggle.styles';

export interface ToggleProps {
  label?: string;
  required?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  onChange: (val: boolean) => void;
  labelOff?: string;
  labelOn?: string;
  isSmall?: boolean;
  tabIndex?: number;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  required = false,
  isActive = false,
  isDisabled = false,
  onChange,
  labelOff,
  labelOn,
  isSmall = false,
  tabIndex = 0,
}) => {
  const Component = isActive ? Styled.toggleActive : Styled.toggle;

  const trigger = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Space') {
      event.preventDefault();
      onChange(!isActive);
    }
  };

  return (
    <Styled.wrapper>
      {label && (
        <>
          <Label label={label} required={required} />
          <Spacer size={2} />
        </>
      )}
      <Styled.toggleWrapper
        data-test="component-toggle"
        onKeyDown={trigger}
        tabIndex={0}
        disabled={isDisabled}
        hasOffLabel={labelOff !== undefined}
        hasOnLabel={labelOn !== undefined}
        small={isSmall}
      >
        {labelOff && (
          <Text
            type={isSmall ? 'bodySmall' : 'body'}
            color={
              isDisabled ? color.base.grey : !isActive ? color.theme.blue : color.base.greyDark
            }
            bold={!isActive}
          >
            <span onClick={() => (isDisabled ? null : onChange(false))}>{labelOff}</span>
          </Text>
        )}
        <Component
          data-test="toggle-control"
          className={classNames({ disabled: isDisabled })}
          onClick={() => (isDisabled ? null : onChange(!isActive))}
          small={isSmall}
          tabIndex={tabIndex}
        >
          <Styled.control small={isSmall} />
        </Component>

        {labelOn && (
          <Text
            type={isSmall ? 'bodySmall' : 'body'}
            color={isDisabled ? color.base.grey : isActive ? color.theme.blue : color.base.greyDark}
            bold={isActive}
          >
            <span onClick={() => (isDisabled ? null : onChange(true))}>{labelOn}</span>
          </Text>
        )}
      </Styled.toggleWrapper>
    </Styled.wrapper>
  );
};

export default Toggle;
