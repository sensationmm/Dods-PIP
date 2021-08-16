import React from 'react';

import LogoWhite from '../../assets/images/logo-white-dods-pip.svg';
import Panel from '../../components/_layout/Panel';
import color from '../../globals/color';
import * as Styled from './Footer.styles';

export interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
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
