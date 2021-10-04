import styled from 'styled-components';

import color from '../../globals/color';
import elevation from '../../globals/elevation';
import media from '../../globals/media';
import spacing from '../../globals/spacing';

export const wrapper = styled.div``;

export const containerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  min-height: 45px;

  > * {
    margin-right: ${spacing(4)};
  }
`;

type ContainerProps = {
  focused: boolean;
};

export const container = styled.div<ContainerProps>`
  padding: ${spacing(4)};
  border: 1px solid ${color.base.greyLight};
  border-radius: 8px;
  background: ${color.base.white};
  box-shadow: ${({ focused }) => (focused ? elevation.dropShadow2 : 'none')};

  ${media.greaterThan('md')`
  > div {
    width: 50%;
  }
  `}
`;

export const containerHeaderTitle = styled.div`
  min-height: 24px;
  white-space: nowrap;
  display: flex;
  align-items: flex-end;
`;

export const containerHeaderEmpty = styled.div`
  min-height: 26px;
  display: flex;
  align-items: flex-end;
`;

export const tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;

  > * {
    margin-right: ${spacing(2)};
    margin-bottom: ${spacing(2)};
  }
`;
