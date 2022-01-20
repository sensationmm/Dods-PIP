import { Icon } from '@dods-ui/components/Icon/Icon.styles';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

export const sectionHeader = styled.div`
  display: flex;

  > ${Icon} {
    margin-right: ${spacing(4)};
  }
`;

export const grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: ${spacing(5)};
`;

export const actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
