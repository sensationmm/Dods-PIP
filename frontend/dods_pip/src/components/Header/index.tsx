import Link from 'next/link';
import React from 'react';

import Logo from '../../assets/images/logo-dods.svg';
import Panel from '../_layout/Panel';
import * as Styled from './Header.styles';

export interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <Styled.wrapper>
      <Panel data-test="component-header" isPadded={false}>
        <Styled.logo>
          <Link href="/">
            <a>
              <Logo layout={'fill'} alt={'Dods Logo'} />
            </a>
          </Link>
        </Styled.logo>
      </Panel>
    </Styled.wrapper>
  );
};

export default Header;
