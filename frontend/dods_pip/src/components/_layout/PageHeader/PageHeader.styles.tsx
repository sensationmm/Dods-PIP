import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';

export const wrapper = styled.header`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${color.base.grey};
  padding-top: ${spacing(1)};
`;

export const container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 180px;

  > div {
    display: inline-block;
  }
`;
