import styled from 'styled-components';

import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const topPart = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const headerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const header = styled.div`
  margin-left: ${spacing(6)};
`;
export const layer = styled.div`
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
`;
