import classNames from 'classnames';
import React from 'react';
import color from '../../globals/color';
import Text from '../Text';

import * as Styled from './PasswordStrength.styles';

export interface PasswordStrengthProps {
  number?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  special?: boolean;
  length8?: boolean;
  disabled?: boolean;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  number = false,
  uppercase = false,
  lowercase = false,
  special = false,
  length8 = false,
  disabled = false,
}) => {
  const items = [
    [
      { label: 'One number', pass: number },
      { label: 'One upper case', pass: uppercase },
      { label: 'One lower case', pass: lowercase },
    ],
    [
      { label: 'One special character', pass: special },
      { label: 'At least 8 characters', pass: length8 },
    ],
  ];

  return (
    <Styled.wrapper data-test="component-password-strength">
      {items.map((group, countGroup) => (
        <div key={`group-${countGroup}`}>
          {group.map((item, countItem) => (
            <Styled.item
              key={`item-${countItem}`}
              data-test={`pass-item-${countGroup}-${countItem}`}
            >
              <Styled.pip className={classNames({ pass: item.pass }, { disabled: disabled })} />
              <Text
                type={'bodySmall'}
                color={
                  !disabled ? (item.pass ? color.alert.green : color.alert.red) : color.base.grey
                }
              >
                {item.label}
              </Text>
            </Styled.item>
          ))}
        </div>
      ))}
    </Styled.wrapper>
  );
};

export default PasswordStrength;
