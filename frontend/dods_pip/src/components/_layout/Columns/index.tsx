import React from 'react';

import * as Styled from './Columns.styles';

export interface ColumnsProps {
  isWelcome?: boolean;
}

const Columns: React.FC<ColumnsProps> = ({ children, isWelcome = false }) => {
  return (
    <Styled.wrapper data-test="component-columns" isWelcome={isWelcome}>
      {children}
    </Styled.wrapper>
  );
};

export default Columns;
