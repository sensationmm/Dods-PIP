import { wrapper as Badge } from '@dods-ui/components/Badge/Badge.styles';
import { Icon } from '@dods-ui/components/Icon/Icon.styles';
import { popoverWrapper as Popover } from '@dods-ui/components/Popover/Popover.styles';
import color from '@dods-ui/globals/color';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

export const sectionHeader = styled.div`
  display: flex;
  align-items: center;

  > ${Icon}, > ${Popover} {
    margin-right: ${spacing(4)};
  }

  > ${Badge} {
    margin-left: ${spacing(12)};
  }
`;

export const sectionHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export const key = styled.div`
  color: ${color.base.white};
  padding: ${spacing(1)} ${spacing(2)};
  border-radius: 8px;
  text-transform: uppercase;
  font-family: 'Open Sans Bold';
`;

export const keyOr = styled(key)`
  background-color: ${color.theme.blueLight};
`;
export const keyAnd = styled(key)`
  background-color: ${color.alert.green};
`;
export const keyNot = styled(key)`
  background-color: ${color.theme.blueMid};
`;
export const keyKeywords = styled(key)`
  background-color: ${color.alert.orange};
`;
