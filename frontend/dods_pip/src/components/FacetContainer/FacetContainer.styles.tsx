import elevation from '@dods-ui/globals/elevation';
import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${color.base.white};
  border: 1px solid ${color.base.greyLight};
  border-radius: ${spacing(2)};
  box-shadow: ${elevation.dropShadowBoxComponent};
  box-sizing: border-box;
  margin-bottom: ${spacing(2)};

  &.content-hidden {
    overflow: hidden;
  }
`;

export const header = styled.header`
  border-bottom: 1px solid ${color.base.greyLight};
  display: flex;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  padding: ${spacing(4)} ${spacing(6)};
`;

export const toggle = styled.button`
  margin-right: ${spacing(3)};
  color: ${color.base.greyDark};
  background: transparent;
  padding: 0;
  border: 0;
  cursor: pointer;

  svg {
    font-weight: bold;
    width: 12px;
  }
`;

export const headingContainer = styled.span`
  flex: 1;
`;

export const clearBtn = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
`;

export const clearBtnText = styled.span`
  margin-left: ${spacing(1)};
  font-size: 12px;
`;

export const childrenContainer = styled.div`
  padding: ${spacing(4)} ${spacing(6)};

  &:empty {
    padding: 0;
  }
`;
