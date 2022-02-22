import styled from 'styled-components';

import spacing from '../../../globals/spacing';

export const wrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const searchValue = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${spacing(11)};
  padding-right: ${spacing(11)};
  white-space: nowrap;
  overflow: hidden;
  width: calc(100% - ${spacing(11)});

  p {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const clear = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: ${spacing(4)};
  z-index: 2;
  cursor: pointer;
`;
