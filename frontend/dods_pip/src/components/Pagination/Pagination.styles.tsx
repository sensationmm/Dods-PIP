import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const stats = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const pages = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const buttonsContainer = styled.div`
  display: flex;
`;

export const button = styled.button`
  border: 0;
  outline: 0;
  background-color: transparent;
  color: ${color.theme.blueMid};
  transition: background linear 0.2s;
  border-radius: ${spacing(1)};
  width: 32px;
  height: 32px;
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${color.shadow.blue};
  }

  &.active {
    background-color: ${color.theme.blueMid};
    color: ${color.base.white};
  }
`;

export const spacer = styled.span`
  width: 32px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const pageChanger = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &.disabled {
    pointer-events: none;
  }
`;

export const perPage = styled.div`
  display: flex;
  align-items: center;

  > *:first-child {
    margin-right: ${spacing(4)};
  }
`;
