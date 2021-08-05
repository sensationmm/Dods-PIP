import React from 'react';

import * as Styled from './Box.styles';

export interface BoxProps {}

const Box: React.FC<BoxProps> = ({ children }) => {
  return <Styled.wrapper data-test="component-box">{children}</Styled.wrapper>;
};

export default Box;
