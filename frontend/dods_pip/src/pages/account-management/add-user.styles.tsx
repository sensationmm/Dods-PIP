import styled from 'styled-components';

import { label as Label } from '../../components/_form/Label/Label.styles';
import { container as PageHeader } from '../../components/_layout/PageHeader/PageHeader.styles';
import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  ${PageHeader} {
    max-width: 720px;
    margin: 0 auto;
  }
`;

export const userType = styled.div`
  display: flex;
  padding-top: ${spacing(7)};
  align-items: center;

  ${Label} {
    margin-bottom: 0;
    margin-right: ${spacing(5)};
  }
`;

export const content = styled.div`
  max-width: 720px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: ${spacing(5)};
  grid-row-gap: ${spacing(6)};
`;

export const pageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${spacing(9)};

  > div {
    margin-left: ${spacing(3)};
  }
`;
