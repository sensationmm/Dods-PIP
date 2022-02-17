import { Icon } from '@dods-ui/components/Icon/Icon.styles';
import color from '@dods-ui/globals/color';
import media from '@dods-ui/globals/media';
import spacing from '@dods-ui/globals/spacing';
import styled from 'styled-components';

export const tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

type TabProps = {
  active: boolean;
};
export const tab = styled.div<TabProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: ${spacing(3)};
  border-bottom: 4px solid ${({ active }) => (active ? color.theme.blueLight : 'transparent')};
  cursor: pointer;

  ${Icon} {
    margin-right: ${spacing(4)};
  }
`;
