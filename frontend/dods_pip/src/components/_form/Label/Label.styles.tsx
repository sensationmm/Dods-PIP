import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';

type LabelProps = {
  noMargin?: boolean;
};

export const label = styled.div<LabelProps>`
  display: flex;
  align-items: baseline;
  margin-bottom: ${({ noMargin }) => (noMargin ? spacing(0) : spacing(3))};
`;

export const requiredStar = styled.span`
  color: ${color.alert.red};
  display: inline;
  font-size: 16px;
  line-height: 16px;
  margin-right: ${spacing(1)};
  align-self: center;
`;

export const requiredLabel = styled.span`
  color: ${color.base.grey};
  font-size: 12px;
  margin-left: ${spacing(2)};
  font-family: 'Open Sans', sans-serif;
  line-height: 16px;
  margin-bottom: -${spacing(1)};
`;

export const parenthetical = styled.span`
  padding-left: 5px;
  color: ${color.base.grey};
`;
