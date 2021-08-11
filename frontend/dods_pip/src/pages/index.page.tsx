import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import color from '../globals/color';
import * as Validation from '../utils/validation';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';

import Button from '../components/Button';
import Text from '../components/Text';
import Box from '../components/_layout/Box';
import Columns from '../components/_layout/Columns';
import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import InputText from '../components/form/InputText';
import InputPassword from '../components/form/InputPassword';
import Checkbox from '../components/form/Checkbox';
import ErrorBox from '../components/_layout/ErrorBox';

import * as Styled from './index.styles';

type Errors = {
  email?: string | undefined;
  password?: string | undefined;
};

interface HomeProps extends LoadingHOCProps {}

export const Home: React.FC<HomeProps> = ({ setLoading }) => {
  const [emailAddress, setEmailAddress] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [remember, setRemember] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [failureCount, setFailureCount] = React.useState<number>(0);

  const validateForm = () => {
    let formErrors = { ...errors };

    if (!Validation.validateRequired(emailAddress)) {
      formErrors.email = 'Email address is required';
    } else if (!Validation.validateEmail(emailAddress)) {
      formErrors.email = 'Invalid format';
    } else {
      delete formErrors.email;
    }

    if (!Validation.validateRequired(password)) {
      formErrors.password = 'Password is required';
    } else {
      delete formErrors.password;
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const onLogin = () => {
    setLoading(true);

    if (validateForm()) {
      setFailureCount(1);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

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
                <Text type={'h4'}>Welcome</Text>

                <Spacer size={6} />

                <InputText
                  data-test={'login-email'}
                  id="login-email"
                  label={'Your email'}
                  value={emailAddress}
                  onChange={setEmailAddress}
                  error={errors.email}
                />

                <Spacer size={4} />

                <InputPassword
                  data-test={'login-password'}
                  id="login-password"
                  label={'Password'}
                  value={password}
                  onChange={setPassword}
                  helperText={'Please enter your password'}
                  error={errors.password}
                />

                {failureCount > 0 && (
                  <>
                    <Spacer size={4} />
                    <ErrorBox data-test={'failure-count'}>
                      <Text type={'bodySmall'} bold>
                        Login error
                      </Text>
                      <Spacer size={2} />
                      <Text type={'bodySmall'}>
                        Try re-typing your password, or reset your password below. If you’ve
                        forgotten your username, please{' '}
                        <Link href="">
                          <a>Contact Us</a>
                        </Link>{' '}
                        directly.
                      </Text>
                      <Styled.failureCount>
                        <Text type={'labelSmall'} uppercase>
                          Attempt {failureCount}/3
                        </Text>
                      </Styled.failureCount>
                    </ErrorBox>
                  </>
                )}

                <Spacer size={6} />

                <Checkbox
                  id={'remember-me'}
                  label={'Remember me'}
                  isChecked={remember}
                  onChange={setRemember}
                />

                <Spacer size={6} />

                <Button data-test={'form-button'} label={'Login'} onClick={onLogin} />

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
                <Text type={'h5'}>Don’t have an account?</Text>
                <Spacer size={4} />
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

export default LoadingHOC(Home);
