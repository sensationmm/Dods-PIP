import styled from 'styled-components';
import color from '../../../globals/color';
import spacing from '../../../globals/spacing';
import elevation from '../../../globals/elevation';

export const wrapper = styled.div`
  position: relative;
  padding: ${spacing(10)};
  background: ${color.base.white};
  border-radius: ${spacing(2)};
  box-shadow: ${elevation.dropShadow2};

  @media (min-width: 1024px) {
    padding: ${spacing(20)};
  }
`;
