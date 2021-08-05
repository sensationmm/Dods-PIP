import React from 'react';
import Image from 'next/image';

import Panel from '../_layout/Panel';
import Logo from '../../assets/logo-dods.svg';

import * as Styled from './Header.styles';

export interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <Styled.wrapper>
      <Panel data-test="component-header" isPadded={false}>
        <Styled.logo>
          <Logo layout={'fill'} alt={'Dods Logo'} />
        </Styled.logo>
      </Panel>
    </Styled.wrapper>
  );
};

export default Header;
