import React from 'react';

import * as Styled from './Box.styles';

export type boxSizing = 'extraSmall' | 'small' | 'medium' | 'large';
export interface BoxProps {
  size?: boxSizing;
}

const Box: React.FC<BoxProps> = ({ size = 'large', children }) => {
  return (
    <Styled.wrapper {...{ size }} data-test="component-box">
      {children}
    </Styled.wrapper>
  );
};

export default Box;
