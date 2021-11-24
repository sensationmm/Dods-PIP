import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import Logo from '../../assets/images/logo-dods.svg';
import { breakpoints } from '../../globals/media';
import fetchJson from '../../lib/fetchJson';
import useUser from '../../lib/useUser';
import { Api, BASE_URI } from '../../utils/api';
import Panel from '../_layout/Panel';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Header.styles';
import NavigationAccount from './NavigationAccount';
import NavigationContent from './NavigationContent';
import NavigationMobile from './NavigationMobile';

export interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();
  const { user, mutateUser } = useUser({ redirectTo: '/' });
  const [navHovered, setNavHovered] = React.useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [accountMenuOpen, setAccountMenuOpen] = React.useState<boolean>(false);
  const [dodsMenuOpen, setDodsMenuOpen] = React.useState<boolean>(false);
  const isMobileOrTablet = useMediaQuery({ query: breakpoints.mobileOrTablet });
  const rootPage = router.pathname.split('/')[1];

  const onLogout = async () => {
    mutateUser(await fetchJson(`${BASE_URI}${Api.Logout}`), false);
    router.push('/');
    setNavHovered(false);
  };

  return (
    <Styled.wrapper>
      <Panel data-test="component-header" isPadded={false}>
        <Styled.containerOuter>
          <Styled.container>
            <Styled.logo>
              <Link href="/">
                <a>
                  <Logo layout={'fill'} alt={'Dods Logo'} />
                </a>
              </Link>
            </Styled.logo>
            {isMobileOrTablet && title && (
              <Text data-test="header-title" type="headerTitle">
                {title}
              </Text>
            )}
            {user?.isLoggedIn && !isMobileOrTablet && (
              <NavigationContent
                user={user}
                rootPage={rootPage}
                navHovered={navHovered}
                setNavHovered={setNavHovered}
              />
            )}
          </Styled.container>

          {user?.isLoggedIn &&
            (!isMobileOrTablet ? (
              <NavigationAccount
                user={user}
                rootPage={rootPage}
                navHovered={navHovered}
                setNavHovered={setNavHovered}
                accountMenuOpen={accountMenuOpen}
                setAccountMenuOpen={setAccountMenuOpen}
                dodsMenuOpen={dodsMenuOpen}
                setDodsMenuOpen={setDodsMenuOpen}
                logout={onLogout}
              />
            ) : mobileMenuOpen ? (
              <div onClick={() => setMobileMenuOpen(false)}>
                <Icon src={Icons.Cross} size={IconSize.xlarge} />
              </div>
            ) : (
              <div onClick={() => setMobileMenuOpen(true)}>
                <Icon src={Icons.Menu} size={IconSize.xlarge} />
              </div>
            ))}
        </Styled.containerOuter>
      </Panel>

      {user?.isLoggedIn && isMobileOrTablet && (
        <NavigationMobile
          active={mobileMenuOpen}
          setActive={setMobileMenuOpen}
          user={user}
          rootPage={rootPage}
          navHovered={navHovered}
          setNavHovered={setNavHovered}
          logout={onLogout}
        />
      )}
    </Styled.wrapper>
  );
};

export default Header;
