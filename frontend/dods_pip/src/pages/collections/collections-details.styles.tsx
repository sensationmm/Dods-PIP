import { wrapper as Badge } from '@dods-ui/components/Badge/Badge.styles';
import { Icon } from '@dods-ui/components/Icon/Icon.styles';
import color from '@dods-ui/globals/color';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

export const alertsHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const alertsHeaderTitle = styled.div`
  display: flex;
  align-items: center;

  > ${Icon} {
    margin-right: ${spacing(4)};
  }

  ${Badge} {
    margin-left: ${spacing(12)};
  }
`;

export const actions = styled.div`
  position: absolute;
  right: ${spacing(6)};
  display: flex;
`;

export const noAlertsMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding-top: ${spacing(5)};
  border-top: 1px solid ${color.base.greyLight};
`;
