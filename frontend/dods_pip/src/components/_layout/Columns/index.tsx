import React from 'react';

import * as Styled from './Columns.styles';

export interface ColumnsProps {}

const Columns: React.FC<ColumnsProps> = ({ children }) => {
  return <Styled.wrapper data-test="component-columns">{children}</Styled.wrapper>;
};

export default Columns;
