import React from 'react';
import Image from 'next/image';

import Panel from '../../components/_layout/Panel';
import color from '../../globals/color';
import LogoWhite from '../../assets/logo-white-dods-pip.svg';

import * as Styled from './Footer.styles';

export interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <Panel data-test="component-footer" bgColor={color.theme.blueDark}>
      <Styled.wrapper>
        <Styled.logo>
          <LogoWhite alt={'Dods PiP Logo'} />
        </Styled.logo>
      </Styled.wrapper>
    </Panel>
  );
};

export default Footer;
