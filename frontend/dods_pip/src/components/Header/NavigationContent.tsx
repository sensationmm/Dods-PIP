import Link from 'next/link';
import React from 'react';

import { UserResponse } from '../../lib/fetchJson';
import * as Styled from './Header.styles';

export interface NavigationContentProps {
  user: UserResponse;
  rootPage: string;
  navHovered: boolean;
  setNavHovered: (active: NavigationContentProps['navHovered']) => void;
}

const NavigationContent: React.FC<NavigationContentProps> = ({
  user,
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
        {[
          { label: 'Repository', path: 'editorial' },
          { label: 'Library', path: 'library' },
          { label: 'People', path: 'people' },
          { label: 'Collections', path: 'collections' },
        ]
          .filter((item) => user.isDodsUser || (!user.isDodsUser && item.path !== 'editorial'))
          .map(({ label, path }) => (
            <li key={`nav-item-${path}`}>
              <Link href={`/${path}`} passHref>
                <Styled.navLink active={rootPage === path} disabled={navHovered}>
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
