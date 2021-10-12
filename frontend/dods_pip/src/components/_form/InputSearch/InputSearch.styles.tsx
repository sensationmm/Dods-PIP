import styled from 'styled-components';

import spacing from '../../../globals/spacing';
import { Icon } from '../../Icon/Icon.styles';
import { input as InputBase } from '../InputBase/InputBase.styles';

type WrapperProps = {
  isFilled: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  position: relative;
  width: 100%;

  ${InputBase} {
    padding-left: ${spacing(11)};
    padding-right: ${({ isFilled }) => (isFilled ? spacing(11) : spacing(3))};
  }

  ${Icon} {
    position: absolute;
    z-index: 2;
    left: ${spacing(4)};
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const clear = styled.div`
  position: absolute;
  z-index: 2;
  right: ${spacing(4)};
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;

  ${Icon} {
    position: relative;
    top: auto;
    transform: none;
    left: auto;
  }
`;
