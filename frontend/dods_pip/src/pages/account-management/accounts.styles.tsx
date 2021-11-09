import styled from 'styled-components';

import { Icon } from '../../components/Icon/Icon.styles';
import spacing from '../../globals/spacing';

export const header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 48px;

  h1 {
    font-weight: 400;
  }
`;

export const filterContainer = styled.div``;

export const filterToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${Icon} {
    margin-left: ${spacing(4)};
  }
`;

export const filterToggleButon = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type FilterContentProps = {
  open: boolean;
};

export const filterContent = styled.div<FilterContentProps>`
  padding-top: ${spacing(4)};
  display: ${(props) => (props.open ? 'flex' : 'none')};
  justify-content: space-between;
  align-items: center;
`;

export const filterContentCol = styled.div`
  display: flex;

  *:not(:last-child) {
    margin-right: ${spacing(3)};
  }
`;

export const teamList = styled.div`
  display: flex;
  min-width: 178px;
  > * {
    margin-right: ${spacing(1)};
    &:last-of-type {
      margin-right: 0;
    }
  }
`;
