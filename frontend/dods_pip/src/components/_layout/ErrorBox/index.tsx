import React from 'react';

import * as Styled from './ErrorBox.styles';

export interface ErrorBoxProps {}

const ErrorBox: React.FC<ErrorBoxProps> = ({ children }) => {
  return <Styled.wrapper data-test="component-error-box">{children}</Styled.wrapper>;
};

export default ErrorBox;
