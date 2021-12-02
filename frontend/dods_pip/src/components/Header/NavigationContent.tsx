import Link from 'next/link';
import React from 'react';

import * as Styled from './Header.styles';
import { Menu } from './index';

export interface NavigationContentProps {
  contentMenu: Menu[];
  rootPage: string;
  navHovered: boolean;
  setNavHovered: (active: NavigationContentProps['navHovered']) => void;
}

const NavigationContent: React.FC<NavigationContentProps> = ({
  contentMenu,
  rootPage,
  navHovered,
  setNavHovered,
}) => {
  return (
    <Styled.navigation
      data-test="navigation-content"
      onMouseEnter={() => setNavHovered(true)}
      onMouseLeave={() => setNavHovered(false)}
    >
      <Styled.navigationList>
        {contentMenu?.map(({ label, url }, count) => (
          <li key={`nav-item-${count}`}>
            <Link href={`/${url}`} passHref>
              <Styled.navLink active={rootPage === url} disabled={navHovered}>
                {label}
              </Styled.navLink>
            </Link>
          </li>
        ))}
      </Styled.navigationList>
    </Styled.navigation>
  );
};

export default NavigationContent;
