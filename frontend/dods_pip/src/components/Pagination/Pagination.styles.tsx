import styled from 'styled-components';

import color from '../../globals/color';
import dropShadow from '../../globals/elevation';
import spacing from '../../globals/spacing';

export const stats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background-color: ${color.base.white};
  border-radius: ${spacing(2)};
  box-shadow: ${dropShadow.dropShadow1};
  color: ${color.theme.blueMid};
  transition: background linear 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: ${spacing(1)};

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: ${color.shadow.blue};
  }

  &.active {
    background-color: ${color.theme.blueMid};
    color: ${color.base.white};
    box-shadow: none;
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

  input {
    font-family: 'Open Sans Bold';
  }
`;

export const inlineNav = styled.div`
  display: flex;
  align-items: center;

  > * {
    margin-right: ${spacing(2)};

    &:last-child {
      margin-right: 0;
    }
  }

  input {
    font-family: 'Open Sans Bold';
  }
`;
