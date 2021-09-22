import React from 'react';

import * as Styled from './SelectMulti.styles';

export interface SelectMultiProps {}

const SelectMulti: React.FC<SelectMultiProps> = () => {
  return <Styled.wrapper data-test="component-select-multi">SelectMulti</Styled.wrapper>;
};

export default SelectMulti;
