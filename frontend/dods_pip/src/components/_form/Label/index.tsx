import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import * as Styled from './Label.styles';

export interface LabelProps {
  label: string | JSX.Element;
  required?: boolean;
  optional?: boolean;
  noMargin?: boolean;
  isDisabled?: boolean;
  bold?: boolean;
  darkMode?: boolean;
  htmlFor?: string;
  parenthetical?: string | number;
}

const Label: React.FC<LabelProps> = ({
  label,
  required,
  optional,
  noMargin,
  isDisabled,
  bold,
  darkMode,
  htmlFor,
  parenthetical,
}) => {
  return (
    <Styled.label data-test="component-label" noMargin={noMargin}>
      {required && <Styled.requiredStar data-test="label-required-star">*</Styled.requiredStar>}
      <Text
        htmlFor={htmlFor}
        type={'label'}
        color={isDisabled ? color.base.greyDark : darkMode ? color.base.white : color.theme.blue}
        bold={bold}
        data-test="text-component"
      >
        {label}
        {parenthetical && <Styled.parenthetical>({parenthetical})</Styled.parenthetical>}
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
