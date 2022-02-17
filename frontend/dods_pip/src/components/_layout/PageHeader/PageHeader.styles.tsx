import styled from 'styled-components';

import color from '../../../globals/color';
import { PageHeaderProps } from '.';

export const wrapper = styled.header`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${color.base.greyLight};
  position: relative;
  z-index: 1;
  background: ${color.base.white};
  min-height: 180px;
`;

type ContainerProps = {
  flexDirection: PageHeaderProps['flexDirection'];
};
export const container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: space-between;
  align-items: ${({ flexDirection }) => (flexDirection === 'row' ? 'center' : 'flex-start')};

  > div {
    display: inline-block;
  }
`;

export const footer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
`;
