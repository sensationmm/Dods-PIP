import styled from 'styled-components';

import spacing from '../../../globals/spacing';

import { input as InputBase } from '../InputBase/InputBase.styles';
import { Icon } from '../../Icon/Icon.styles';

export const wrapper = styled.div`
  position: relative;
  width: 100%;

  &.icon {
    ${InputBase} {
      width: calc(100% - ${spacing(14)});
      padding-right: ${spacing(11)};
    }
  }

  ${Icon} {
    position: absolute;
    z-index: 2;
    right: ${spacing(4)};
    top: ${spacing(3)};
  }
`;
