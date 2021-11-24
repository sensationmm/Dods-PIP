import Link from 'next/link';
import React from 'react';

import LogoWhite from '../../assets/images/logo-dods.svg';
import Panel from '../../components/_layout/Panel';
import color from '../../globals/color';
import Text from '../Text';
import Spacer from '../_layout/Spacer';
import * as Styled from './Footer.styles';

export interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Styled.container>
      <Panel data-test="component-footer" bgColor={color.theme.blue}>
        <Styled.wrapper>
          <div>
            <Text type="bodyLarge" bold color={color.base.white}>
              Customer Service
            </Text>
            <Spacer size={6} />
            <Text type="bodyLarge" bold color={color.base.white}>
              Get in touch
            </Text>
            <Spacer size={4} />
            <Text color={color.base.white}>+44 207 593 5500</Text>
            <Spacer />
            <Text color={color.base.white}>customer.service@dodsgroup.com</Text>
          </div>

          <Styled.branding>
            <Styled.logo>
              <LogoWhite alt={'Dods PiP Logo'} />
            </Styled.logo>
            <Text type="bodyLarge" bold uppercase color={color.base.white}>
              Political
              <br />
              Intelligence
            </Text>
          </Styled.branding>
        </Styled.wrapper>
      </Panel>

      <Styled.footerSub>
        <Panel isPadded={false} data-test="component-footer" bgColor={color.theme.blueDark}>
          <Styled.wrapper>
            <ul>
              <li>
                <Link href="/privacy-policy">
                  <a>Privacy policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions">
                  <a>Terms &amp; Conditions</a>
                </Link>
              </li>
            </ul>

            <div>
              <Text color={color.base.white}>&copy; Merit Group PLC 2022</Text>
            </div>
          </Styled.wrapper>
        </Panel>
      </Styled.footerSub>
    </Styled.container>
  );
};

export default Footer;
