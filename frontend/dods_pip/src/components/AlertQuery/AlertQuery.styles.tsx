import { Icon } from '@dods-ui/components/Icon/Icon.styles';
import color from '@dods-ui/globals/color';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

export const wrapper = styled.div`
  border-radius: 8px;
  border: 1px solid ${color.base.greyLight};
  background: ${color.base.greyLighter};
  padding: ${spacing(4)};
`;

export const box = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  grid-column-gap: ${spacing(2)};
  background: ${color.base.white};
  border-radius: 8px;
  padding: ${spacing(4)};

  > p {
    padding-top: 3px;
  }
`;

export const terms = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: ${spacing(5)};
`;

export const termsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 35px;
`;

export const valid = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  > ${Icon} {
    margin-right: ${spacing(2)};
  }
`;

export const actions = styled.div`
  display: flex;
  justify-content: flex-end;

  > div {
    margin-left: ${spacing(2)};
  }
`;

export const formattedLabels = styled.div`
  p {
    display: inline-block;
    margin-right: 5px;
    margin-top: 3px;
  }
`;

export const preview = styled.div`
  pointer-events: none;
  background: ${color.base.greyLight};
  border-radius: 8px;
  padding: ${spacing(3)};
  min-height: 140px;
`;
