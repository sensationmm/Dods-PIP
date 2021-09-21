import React from 'react';

import color from '../../../globals/color';
import Text from '../../Text';
import * as Styled from './Label.styles';

export interface LabelProps {
  label: string;
  required?: boolean;
  optional?: boolean;
}

const Label: React.FC<LabelProps> = ({ label, required = false, optional = false }) => {
  return (
    <Styled.label data-test="component-label">
      {required && <Styled.requiredStar data-test="label-required-star">*</Styled.requiredStar>}
      <Text type="label" color={color.theme.blue}>
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
