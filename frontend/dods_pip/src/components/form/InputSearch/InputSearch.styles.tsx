import styled from 'styled-components';

import spacing from '../../../globals/spacing';

import { input as InputBase } from '../InputBase/InputBase.styles';
import { Icon } from '../../Icon/Icon.styles';

export const wrapper = styled.div`
  position: relative;
  width: 100%;

  ${InputBase} {
    padding-left: ${spacing(11)};
  }

  ${Icon} {
    position: absolute;
    z-index: 2;
    left: ${spacing(4)};
    top: ${spacing(3)};
  }
`;
