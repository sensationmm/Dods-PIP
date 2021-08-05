import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import color from '../globals/color';

import Button from '../components/Button';
import Text from '../components/Text';
import Box from '../components/_layout/Box';
import Columns from '../components/_layout/Columns';
import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import InputText from '../components/form/InputText';
import InputPassword from '../components/form/InputPassword';
import Checkbox from '../components/form/Checkbox';

const Home = () => {
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(false);

  return (
    <div data-test="page-home">
      <Head>
        <title>Dods PIP | Welcome to Dods</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Panel isWelcome>
          <Columns>
            <div>
              <Text type={'h1'}>Political Intelligence Platform</Text>
              <Spacer size={12} />
              <Text bold>Better decisions. For a better tomorrow.</Text>
              <Spacer size={4} />
              <Text>
                We harness insights from over two centuries of experience, through the specialised
                knowledge of our Consultants, and our innovative technologies.
              </Text>
              <Spacer size={4} />
              <Text>
                Dods PIP is the market leading, Global political intelligence ervice, facilitating
                comprehensive monitoring of people, political and policy developments.
              </Text>
              <Spacer size={12} />
              <Button type={'secondary'} inline label={'Find out more'} />
            </div>

            <div>
              <Box>
                <Text type={'h2'}>Welcome</Text>
                <Spacer size={6} />
                <InputText label={'Your email'} value={emailAddress} onChange={setEmailAddress} />
                <Spacer size={4} />
                <InputPassword
                  label={'Password'}
                  value={password}
                  onChange={setPassword}
                  helperText={'Please enter your password'}
                />
                <Spacer size={6} />
                <Checkbox
                  id={'remember-me'}
                  label={'Remember me'}
                  isChecked={remember}
                  onChange={setRemember}
                />
                <Spacer size={6} />
                <Button label={'Login'} />
                <Spacer size={4} />
                <Text type="span" center color={color.theme.blueMid}>
                  <Link href="">
                    <a>Forgot your password?</a>
                  </Link>
                </Text>
                <Spacer size={6} />
                <Text type="span" center color={color.theme.blueMid}>
                  If you’ve forgotten your username, please{' '}
                  <Link href="">
                    <a>Contact Us</a>
                  </Link>{' '}
                  directly.
                </Text>
              </Box>

              <Spacer size={4} />

              <Box>
                <Text type={'h3'}>Don’t have an account?</Text>
                <Spacer size={2} />
                <Text type={'span'} center color={color.theme.blueMid}>
                  If you don’t have an account with Dods, why not sign up for the free trial?
                </Text>
                <Spacer size={8} />
                <Button label={'Start Free Trial'} />
              </Box>
            </div>
          </Columns>
        </Panel>
      </main>
    </div>
  );
};

export default Home;
