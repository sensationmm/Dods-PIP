import styled from 'styled-components';

import color from '../../globals/color';
import mediaQueries from '../../globals/media';
import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;

  ${mediaQueries('md')`
    display: grid;
    grid-template-columns: 1fr 1fr;
  `}
`;

export const item = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing(2)};
`;

export const pip = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: ${color.alert.red};
  margin-right: ${spacing(2)};

  &.pass {
    background: ${color.alert.green};
  }

  &.disabled {
    background: ${color.base.grey};
  }
`;
