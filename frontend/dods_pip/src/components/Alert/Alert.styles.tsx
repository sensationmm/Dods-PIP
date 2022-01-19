import color from '@dods-ui/globals/color';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

import elevation from '../../globals/elevation';

export const wrapper = styled.div`
  width: 100%;
  border-radius: 8px;
  box-shadow: ${elevation.dropShadow1};

  &:hover {
    box-shadow: ${elevation.dropShadow2};
  }
`;

export const content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing(6)} ${spacing(8)};
  min-height: 135px;
  box-sizing: content-box;
`;

export const details = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;

    li {
      margin-right: ${spacing(6)};
    }
  }
`;

export const deliveryTitle = styled.div`
  display: flex;
  align-items: center;
`;

export const times = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  grid-row-gap: ${spacing(2)};
  grid-column-gap: ${spacing(1)};
`;

export const time = styled.div`
  border-radius: 60px;
  padding: ${spacing(2)} ${spacing(3)};
  border: 1px solid ${color.base.greyLight};
`;

export const timeAdded = styled.div`
  padding: ${spacing(3)} ${spacing(2)};
  display: block;
`;

export const actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing(4)} ${spacing(8)} ${spacing(4)} ${spacing(4)};
  background: ${color.base.greyLighter};

  > div {
    display: flex;
  }
`;

export const actionsButtons = styled.div`
  > div {
    margin-left: ${spacing(2)};
  }
`;
