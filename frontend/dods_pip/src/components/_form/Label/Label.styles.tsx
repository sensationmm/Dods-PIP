import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';

export const label = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: ${spacing(3)};
`;

export const requiredStar = styled.span`
  color: ${color.alert.red};
  display: inline;
  font-size: 12px;
  line-height: 12px;
  margin-right: ${spacing(1)};
  align-self: center;
`;

export const requiredLabel = styled.span`
  color: ${color.base.grey};
  font-size: 12px;
  margin-left: ${spacing(2)};
  font-family: Open Sans;
  line-height: 16px;
  margin-bottom: -${spacing(1)};
`;
