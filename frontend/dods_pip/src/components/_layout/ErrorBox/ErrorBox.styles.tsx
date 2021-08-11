import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';

import { p as Text } from '../../Text/Text.styles';

export const wrapper = styled.div`
  width: 100%;
  background: ${color.shadow.red};
  padding: ${spacing(3)} !important;
  border-radius: ${spacing(2)};

  ${Text} {
    color: ${color.alert.red} !important;
  }
`;
