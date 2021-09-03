import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';
import { Icon } from '../Icon/Icon.styles';
import { label } from '../Text/Text.styles';

export const wrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${color.shadow.blue};
  border-top: 1px solid ${color.shadow.blue};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const letterSection = styled.div`
  padding: ${spacing(5)} ${spacing(1)};
  display: flex;
  align-items: center;
`;

type Props = {
  selected: boolean;
};

export const letter = styled.div<Props>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: ${spacing(8.5)};
  height: ${spacing(8.5)};
  background: ${(props) => (props.selected ? color.theme.blue : 'transparent')};
  color: ${(props) => (props.selected ? color.base.white : color.theme.blue)};
  border-radius: 50%;
  &:hover {
    background: ${(props) => (!props.selected ? color.shadow.grey : color.theme.blue)};
    color: ${(props) => (!props.selected ? color.base.white : color.theme.blue)};
  }
`;

export const viewAll = styled.span`
  cursor: pointer;
  margin-left: ${spacing(2)};
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;

  ${Icon} {
    margin-right: ${spacing(2)};
  }

  ${Icon}, ${label} {
    cursor: pointer;
  }
`;
