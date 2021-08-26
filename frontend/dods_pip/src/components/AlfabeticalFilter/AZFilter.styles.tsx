import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${color.shadow.blue};
  border-top: 1px solid ${color.shadow.blue};
  display: flex;
  align-items: center;
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
  border-radius: 50%;
  ${(props) => (props.selected ? '' : '&: hover { background: color.theme.blue; opacity:0.24 }')}
`;

export const viewAll = styled.span`
  cursor: pointer;
  margin-right: ${spacing(15)};
  margin-left: ${spacing(2)};
  display: flex;
  justify-content: center;
  align-items: center;
`;
