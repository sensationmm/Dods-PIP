import styled from 'styled-components';

import color from '../../globals/color';
import elevation from '../../globals/elevation';
import media from '../../globals/media';
import spacing from '../../globals/spacing';
import { panel as Panel } from '../_layout/Panel/Panel.styles';
import { wrapper as Avatar } from '../Avatar/Avatar.styles';
import { Icon } from '../Icon/Icon.styles';

export const wrapper = styled.div`
  width: 100%;
  position: fixed;
  z-index: 4;
  box-shadow: ${elevation.dropShadow1};

  ${Panel} {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

export const logo = styled.div`
  position: relative;
  width: 80px;
  height: 50px;
  margin-right: ${spacing(4)};
  color: ${color.theme.blue};

  ${media.greaterThan('md')`
    margin-right: ${spacing(10)};
  `};
`;

export const containerOuter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-height: 66px;
`;

export const navigation = styled.nav``;

type NavigationMobileProps = {
  active: boolean;
};
export const navigationMobile = styled.nav<NavigationMobileProps>`
  position: fixed;
  top: ${({ active }) => (active ? '66px' : '-100vh')};
  left: 0;
  width: 100vw;
  height: calc(100vh - 66px);
  background: ${color.base.white};
  transition: top linear 0.2s;
  padding: ${spacing(6)};
  border-top: 2px solid ${color.base.greyLight};

  ${Avatar} {
    margin-right: ${spacing(2)};
  }
`;

export const navigationMobileMask = styled.div`
  height: calc(100% - 52px);
  overflow: auto;
`;

export const navigationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  ${media.greaterThan('md')`
    display: flex;
  `};
`;

type NavLinkProps = {
  active: boolean;
  disabled: boolean;
};
export const navLink = styled.a<NavLinkProps>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: ${({ active }) => (active ? 'Open Sans Bold' : 'Open Sans')};
  text-decoration: none;
  padding: ${spacing(5)};
  color: ${({ disabled }) => (disabled ? color.base.grey : color.theme.blue)};

  > ${Icon} {
    margin-left: ${spacing(3)};
    transition: all linear 0.2s;
    transform: ${({ active }) => (active ? 'rotate(180deg)' : 'none')};
  }

  &:hover {
    color: ${color.theme.blue} !important;
    border-color: ${color.theme.blue};
  }

  ${({ active, disabled }) => media.greaterThan('md')`
  border-bottom: 4px solid
    ${active && !disabled ? color.theme.blue : 'transparent'};
  `};
`;

export const account = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > ${navigation} {
    margin-right: ${spacing(2)};
  }
`;

export const accountNav = styled.div`
  position: relative;
`;

type AccountTriggerOptions = {
  active: boolean;
};
export const accountTrigger = styled.div<AccountTriggerOptions>`
  padding: ${spacing(2)} ${spacing(3)} ${spacing(2)} ${spacing(2)};
  border: 1px solid ${color.base.greyLight};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: ${({ active }) => (active ? color.base.greyLight : 'transparent')};

  &:hover {
    background: ${color.base.greyLight};
  }

  ${Avatar} {
    margin-right: ${spacing(3)};
  }

  > ${Icon} {
    transition: all linear 0.2s;
    transform: ${({ active }) => (active ? 'rotate(180deg)' : 'none')};
  }
`;

export const accountMenu = styled.div`
  position: absolute;
  box-shadow: ${elevation.notification};
  background: ${color.base.white};
  border-radius: 8px;
  white-space: nowrap;
  top: calc(100% + ${spacing(5)});
  right: 0;
  overflow: hidden;
`;

export const accountMenuSub = styled.div`
  position: relative;
  padding-left: ${spacing(8)};

  &:before {
    position: absolute;
    top: 0;
    left: ${spacing(8)};
    content: '';
    width: 2px;
    height: 100%;
    background: ${color.base.greyLight};
  }
`;

export const accountMenuItem = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${color.theme.blue};

  > ${Icon} {
    margin-right: ${spacing(4)};
  }

  > a,
  > div {
    color: ${color.theme.blue};
    padding: ${spacing(4)} ${spacing(6)};
  }

  > a,
  > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-family: 'Open Sans';
    text-decoration: none;

    > ${Icon} {
      margin-right: ${spacing(4)};
    }
  }

  &:hover {
    background: ${color.base.greyLight};
  }

  &:last-child {
    margin-bottom: 0;
  }

  ${media.lessThan('md')`
    border-radius: 8px;
  `}
`;

export const accountMenuItemTrigger = styled.div<AccountTriggerOptions>`
  position: absolute;
  right: ${spacing(6)};
  top: 50%;
  transform: translateY(-50%);

  > ${Icon} {
    transition: all linear 0.2s;
    transform: ${({ active }) => (active ? 'rotate(180deg)' : 'none')};
  }
`;

export const logout = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: ${spacing(2)} ${spacing(6)} ${spacing(6)} ${spacing(8)};
  background: ${color.base.white};
`;
