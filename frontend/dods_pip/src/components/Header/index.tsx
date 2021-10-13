import Link from 'next/link';
import React from 'react';

import Logo from '../../assets/images/logo-dods.svg';
import Panel from '../_layout/Panel';
import Text from '../Text';
import * as Styled from './Header.styles';

export interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Styled.wrapper>
      <Panel data-test="component-header" isPadded={false}>
        <Styled.container>
          <Styled.logo>
            <Link href="/">
              <a>
                <Logo layout={'fill'} alt={'Dods Logo'} />
              </a>
            </Link>
          </Styled.logo>
          {title && (
            <Text data-test="header-title" type="headerTitle">
              {title}
            </Text>
          )}
        </Styled.container>
      </Panel>
    </Styled.wrapper>
  );
};

export default Header;
