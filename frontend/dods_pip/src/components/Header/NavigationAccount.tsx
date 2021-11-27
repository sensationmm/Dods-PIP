import Link from 'next/link';
import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import color from '../../globals/color';
import { UserResponse } from '../../lib/fetchJson';
import Avatar from '../Avatar';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import * as Styled from './Header.styles';

export interface NavigationAccountProps {
  user: UserResponse;
  rootPage: string;
  navHovered: boolean;
  setNavHovered: (active: NavigationAccountProps['navHovered']) => void;
  accountMenuOpen: boolean;
  setAccountMenuOpen: (active: NavigationAccountProps['accountMenuOpen']) => void;
  dodsMenuOpen: boolean;
  setDodsMenuOpen: (active: NavigationAccountProps['dodsMenuOpen']) => void;
  logout: () => void;
}

const NavigationAccount: React.FC<NavigationAccountProps> = ({
  user,
  rootPage,
  navHovered,
  setNavHovered,
  accountMenuOpen,
  setAccountMenuOpen,
  dodsMenuOpen,
  setDodsMenuOpen,
  logout,
}) => {
  return (
    <Styled.account data-test="navigation-account">
      <Styled.navigation
        data-test="navigation"
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
      >
        <Styled.navigationList>
          {user.isDodsUser ? (
            <li>
              <OutsideClickHandler
                onOutsideClick={/* istanbul ignore next */ () => setDodsMenuOpen(false)}
              >
                <Styled.navLink
                  data-test="dods-nav"
                  active={dodsMenuOpen}
                  disabled={navHovered}
                  onClick={() => setDodsMenuOpen(!dodsMenuOpen)}
                >
                  Dods
                  <Icon src={Icons.ArrowDown} />
                  {dodsMenuOpen && (
                    <Styled.accountMenu>
                      <Styled.accountMenuItem>
                        <Link href={`/accounts/${user.clientAccountId}`}>
                          <a>
                            <Icon
                              src={Icons.Building}
                              size={IconSize.mediumLarge}
                              color={color.base.greyDark}
                            />
                            Dods
                          </a>
                        </Link>
                      </Styled.accountMenuItem>
                      <Styled.accountMenuItem>
                        <Link href="/account-management/accounts">
                          <a>
                            <Icon
                              src={Icons.List}
                              size={IconSize.mediumLarge}
                              color={color.base.greyDark}
                            />
                            Accounts
                          </a>
                        </Link>
                      </Styled.accountMenuItem>
                      <Styled.accountMenuItem>
                        <Link href="/account-management/users">
                          <a>
                            <Icon
                              src={Icons.List}
                              size={IconSize.mediumLarge}
                              color={color.base.greyDark}
                            />
                            Users
                          </a>
                        </Link>
                      </Styled.accountMenuItem>
                    </Styled.accountMenu>
                  )}
                </Styled.navLink>
              </OutsideClickHandler>
            </li>
          ) : (
            <li>
              <Link href={`/accounts/${user.clientAccountId}`} passHref>
                <Styled.navLink active={rootPage === 'my-profile'} disabled={navHovered}>
                  {user.clientAccountName}
                </Styled.navLink>
              </Link>
            </li>
          )}
        </Styled.navigationList>
      </Styled.navigation>

      <OutsideClickHandler
        onOutsideClick={/* istanbul ignore next */ () => setAccountMenuOpen(false)}
      >
        <Styled.accountNav
          data-test="account-nav"
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        >
          <Styled.accountTrigger
            data-test="account-trigger"
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            active={accountMenuOpen}
          >
            <Avatar type={user.isDodsUser ? 'consultant' : 'client'} size="small" />
            <Icon src={Icons.ArrowDown} />
            {accountMenuOpen && (
              <Styled.accountMenu>
                <Styled.accountMenuItem>
                  <Link href="/my-profile">
                    <a>
                      <Icon
                        src={Icons.Person}
                        size={IconSize.mediumLarge}
                        color={color.base.greyDark}
                      />
                      My profile
                    </a>
                  </Link>
                </Styled.accountMenuItem>
                <Styled.accountMenuItem>
                  <div onClick={logout}>
                    <Icon
                      src={Icons.Exit}
                      size={IconSize.mediumLarge}
                      color={color.base.greyDark}
                    />
                    Log out
                  </div>
                </Styled.accountMenuItem>
              </Styled.accountMenu>
            )}
          </Styled.accountTrigger>
        </Styled.accountNav>
      </OutsideClickHandler>
    </Styled.account>
  );
};

export default NavigationAccount;
