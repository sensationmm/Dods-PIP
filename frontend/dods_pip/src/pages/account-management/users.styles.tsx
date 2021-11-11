import styled from 'styled-components';

import { primary as primaryBtn } from '../../components/Button/Button.styles';
import { Icon } from '../../components/Icon/Icon.styles';
import color from '../../globals/color';
import dropShadow from '../../globals/elevation';
import spacing from '../../globals/spacing';

export const header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 48px;

  h1 {
    font-weight: 400;
  }

  ${primaryBtn} {
    box-shadow: ${dropShadow.dropShadow1};
  }
`;

export const filterContainer = styled.div``;

export const filterToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${Icon} {
    margin-left: ${spacing(4)};
  }
`;

export const filterToggleBtn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

type FilterContentProps = {
  open: boolean;
};

export const filterContent = styled.div<FilterContentProps>`
  padding-top: ${spacing(4)};
  display: ${(props) => (props.open ? 'flex' : 'none')};
  justify-content: space-between;
  align-items: center;
`;

export const filterContentCol = styled.div`
  display: flex;

  *:not(:last-child) {
    margin-right: ${spacing(3)};
  }
`;

export const avatarName = styled.div`
  display: flex;

  > div {
    margin-right: ${spacing(2.5)};
  }
`;

export const email = styled.div`
  a {
    font-family: 'OpenSans', sans-serif;
    color: ${color.theme.blueLight};

    &:focus,
    &:hover {
      color: ${color.theme.blueMid};
    }
  }
`;
