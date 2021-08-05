import styled from 'styled-components';

import color from '../../globals/color';

export const button = styled.button`
  outline: 0;
  border: 0;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${color.base.white};
  background-color: ${color.theme.blueMid};

  &:hover,
  &:focus {
    background-color: ${color.theme.blueDark};
  }

  &.disabled {
    pointer-events: none;
    background-color: ${color.shadow.grey};
  }
`;
