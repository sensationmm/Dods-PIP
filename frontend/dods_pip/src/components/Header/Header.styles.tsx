import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;
  border-bottom: 4px solid ${color.shadow.blue};
  padding-top: ${spacing(1)};
`;

export const logo = styled.div`
  position: relative;
  width: 80px;
  height: 50px;
  margin-right: ${spacing(10)};
`;

export const container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
