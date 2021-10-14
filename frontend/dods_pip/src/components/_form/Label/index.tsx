import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import * as Styled from './Label.styles';

export interface LabelProps {
  label?: string;
  required?: boolean;
  optional?: boolean;
  noMargin?: boolean;
  isDisabled?: boolean;
  bold?: boolean;
  darkMode?: boolean;
}

const Label: React.FC<LabelProps> = ({
  label,
  required,
  optional,
  noMargin,
  isDisabled,
  bold,
  darkMode,
}) => {
  return (
    <Styled.label data-test="component-label" noMargin={noMargin}>
      {required && <Styled.requiredStar data-test="label-required-star">*</Styled.requiredStar>}
      <Text
        type={bold ? 'body' : 'label'}
        color={isDisabled ? color.base.greyDark : darkMode ? color.base.white : color.theme.blue}
        bold={bold}
        data-test="text-component"
      >
        {label}
      </Text>
      {required && (
        <Styled.requiredLabel data-test="label-required">(Required)</Styled.requiredLabel>
      )}
      {!required && optional && (
        <Styled.requiredLabel data-test="label-required">(Optional)</Styled.requiredLabel>
      )}
    </Styled.label>
  );
};

export default Label;
