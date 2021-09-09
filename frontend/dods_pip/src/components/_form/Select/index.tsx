import React from 'react';

import * as Styled from './Select.styles';

export interface SelectProps {}

const Select: React.FC<SelectProps> = () => {
  return <Styled.wrapper data-test="component-select">Select</Styled.wrapper>;
};

export default Select;
