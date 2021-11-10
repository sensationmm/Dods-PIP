import styled from 'styled-components';

import spacing from '../../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const searchValue = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${spacing(11)};
`;
