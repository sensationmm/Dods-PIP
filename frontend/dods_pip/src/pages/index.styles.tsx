import styled from 'styled-components';
import color from '../globals/color';
import spacing from '../globals/spacing';

import { label as Text } from '../components/Text/Text.styles';

export const failureCount = styled.span`
  position: absolute;
  top: ${spacing(2)};
  right: ${spacing(2)};
  padding: 0 ${spacing(2)} ${spacing(1)} ${spacing(2)};
  color: ${color.base.white};
  background: ${color.accent.orange};
  border-radius: ${spacing(1)};

  ${Text} {
    color: ${color.base.white} !important;
  }
`;
