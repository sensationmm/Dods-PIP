import Link from 'next/link';
import React from 'react';

import color from '../../globals/color';
import { UserResponse } from '../../lib/fetchJson';
import Avatar from '../Avatar';
import Button from '../Button';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import * as Styled from './Header.styles';
import { Menu } from './index';

export interface NavigationMobileProps {
  active: boolean;
  dodsMenu: Menu[];
  contentMenu: Menu[];
  setActive: (active: NavigationMobileProps['active']) => void;
  user: UserResponse;
  rootPage: string;
  navHovered: boolean;
  setNavHovered: (active: NavigationMobileProps['navHovered']) => void;
  logout: () => void;
}

const NavigationMobile: React.FC<NavigationMobileProps> = ({
  active,
  dodsMenu,
  contentMenu,
  setActive,
  user,
  rootPage,
  navHovered,
  logout,
}) => {
  const [dodsMenuOpen, setDodsMenuOpen] = React.useState<boolean>(false);

  return (
    <Styled.navigationMobile active={active} data-test="navigation-mobile">
      <Styled.navigationMobileMask>
        <Styled.navigationList>
          {contentMenu?.map(({ label, url }, count) => (
            <li key={`nav-item-${count}`} onClick={() => setActive(false)}>
              <Link href={`/${url}`} passHref>
                <Styled.navLink active={rootPage === url} disabled={navHovered}>
                  {label}
                </Styled.navLink>
              </Link>
            </li>
          ))}
        </Styled.navigationList>
        {user.isDodsUser ? (
          <>
            <Styled.accountMenuItem
              data-test="dods-menu"
              onClick={() => setDodsMenuOpen(!dodsMenuOpen)}
            >
              <Icon src={Icons.Building} size={IconSize.mediumLarge} color={color.theme.blueMid} />
              Dods
              <Styled.accountMenuItemTrigger active={dodsMenuOpen}>
                <Icon src={Icons.ArrowDown} />
              </Styled.accountMenuItemTrigger>
            </Styled.accountMenuItem>
            {dodsMenuOpen && (
              <Styled.accountMenuSub>
                {dodsMenu?.map(({ label, url }, count) => (
                  <Styled.accountMenuItem
                    data-test={`menu-item-${count}`}
                    key={`menu-item-${count}`}
                    onClick={() => setActive(false)}
                  >
                    <Link href={url}>
                      <a>{label}</a>
                    </Link>
                  </Styled.accountMenuItem>
                ))}
              </Styled.accountMenuSub>
            )}
          </>
        ) : (
          <Styled.accountMenuItem data-test="menu-item-account" onClick={() => setActive(false)}>
            <Link href={`/accounts/${user.clientAccountId}`}>
              <a>
                <Icon
                  src={Icons.Building}
                  size={IconSize.mediumLarge}
                  color={color.theme.blueMid}
                />
                {user.clientAccountName}
              </a>
            </Link>
          </Styled.accountMenuItem>
        )}
        <Styled.accountMenuItem data-test="menu-item-profile" onClick={() => setActive(false)}>
          <Link href="/my-profile">
            <a>
              <Avatar type={user.isDodsUser ? 'consultant' : 'client'} size="small" />
              My Account
            </a>
          </Link>
        </Styled.accountMenuItem>
      </Styled.navigationMobileMask>

      <Styled.logout>
        <Button
          type="secondary"
          data-test={'logout-button'}
          label={'Logout'}
          onClick={logout}
          icon={Icons.Exit}
          width="full"
        />
      </Styled.logout>
    </Styled.navigationMobile>
  );
};

export default NavigationMobile;
