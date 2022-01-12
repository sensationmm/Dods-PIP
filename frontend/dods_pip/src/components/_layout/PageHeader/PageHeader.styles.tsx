import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';
import { PageHeaderProps } from '.';

export const wrapper = styled.header`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${color.base.greyLight};
  padding-top: ${spacing(1)};
  position: relative;
  z-index: 2;
  background: ${color.base.white};
`;

type ContainerProps = {
  flexDirection: PageHeaderProps['flexDirection'];
};
export const container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: space-between;
  align-items: ${({ flexDirection }) => (flexDirection === 'row' ? 'center' : 'flex-start')};
  min-height: 180px;
  padding: ${spacing(12)} 0;

  > div {
    display: inline-block;
  }
`;
