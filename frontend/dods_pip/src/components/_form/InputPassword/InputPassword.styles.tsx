import styled from 'styled-components';

import spacing from '../../../globals/spacing';
import { input as InputBase } from '../InputBase/InputBase.styles';

export const wrapper = styled.div`
  position: relative;
  width: 100%;

  ${InputBase} {
    padding-right: ${spacing(11)};
  }
`;

export const toggle = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 2;
  right: ${spacing(4)};
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;
