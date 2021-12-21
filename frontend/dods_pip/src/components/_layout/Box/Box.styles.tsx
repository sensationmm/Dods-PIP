import styled from 'styled-components';

import color from '../../../globals/color';
import elevation from '../../../globals/elevation';
import spacing from '../../../globals/spacing';
import { boxSizing } from './index';

const THEME = {
  extraSmall: { paddingDesktop: spacing(2) },
  small: { paddingDesktop: spacing(8) },
  medium: { paddingDesktop: spacing(14) },
  large: { paddingDesktop: spacing(20) },
};

export const wrapper = styled.div.attrs(({ size }: { size: boxSizing }) => {
  const { paddingDesktop } = THEME[size];
  return {
    paddingDesktop,
  };
})`
  position: relative;
  padding: ${spacing(10)};
  background: ${color.base.white};
  border-radius: ${spacing(2)};
  box-shadow: ${elevation.dropShadow2};

  @media (min-width: 1024px) {
    padding: ${(props) => props.paddingDesktop};
  }
`;
