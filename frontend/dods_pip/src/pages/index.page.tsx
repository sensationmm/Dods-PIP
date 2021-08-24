import classNames from 'classnames';
import cookieCutter from 'cookie-cutter';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect } from 'react';

import Checkbox from '../components/_form/Checkbox';
import InputPassword from '../components/_form/InputPassword';
import InputText from '../components/_form/InputText';
import Box from '../components/_layout/Box';
import Columns from '../components/_layout/Columns';
import ErrorBox from '../components/_layout/ErrorBox';
import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import Button from '../components/Button';
import Text from '../components/Text';
import color from '../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';
import fetchJson from '../lib/fetchJson';
import useUser from '../lib/useUser';
import * as Validation from '../utils/validation';
import * as Styled from './index.styles';

type Errors = {
  email?: string | undefined;
  password?: string | undefined;
};

interface HomeProps extends LoadingHOCProps {}

export const Home: React.FC<HomeProps> = ({ setLoading }) => {
  let storedEmail = '',
    storedPassword = '';
  if (cookieCutter) {
    storedEmail = cookieCutter.get && cookieCutter.get('dods-login-username');
    storedPassword = cookieCutter.get && cookieCutter.get('dods-login-password');
  }
  const [emailAddress, setEmailAddress] = React.useState<string>(storedEmail);
  const [password, setPassword] = React.useState<string>(storedPassword);
  const [remember, setRemember] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [failureCount, setFailureCount] = React.useState<number>(0);
  const [unblockingRequested, setUnblockingRequested] = React.useState(false);

  useEffect(() => {
    if (storedEmail && storedEmail.length > 0) {
      setRemember(true);
    }
  }, [storedEmail]);

  const { mutateUser } = useUser({
    redirectTo: '/dashboard',
    redirectIfFound: true,
  });

  const validateForm = () => {
    const formErrors = { ...errors };

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

  async function handleLogin() {
    const body = {
      email: emailAddress,
      password: password,
    };

    try {
      const user = await fetchJson('/api/login', {
        body: JSON.stringify(body),
      });
      mutateUser(user);
    } catch (error) {
      if (error.data.name === 'NotAuthorizedException') {
        setFailureCount(error.data.failedLoginAttemptCount);
      }
    }
  }

  async function handleUnblocking() {
    try {
      await fetchJson('/api/enableUser', {
        body: JSON.stringify({ email: emailAddress }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onLogin = async () => {
    setLoading(true);

    if (validateForm()) {
      await handleLogin().then(() => {
        if (remember) {
          cookieCutter.set('dods-login-username', emailAddress);
          cookieCutter.set('dods-login-password', password);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };

  const onUnblock = async () => {
    setLoading(true);

    await handleUnblocking();
    setFailureCount(0);
    setUnblockingRequested(true);
    setLoading(false);
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
                Dods PIP is the market leading, Global political intelligence service, facilitating
                comprehensive monitoring of people, political and policy developments.
              </Text>
              <Spacer size={12} />
              <Button type={'secondary'} inline label={'Find out more'} />
            </div>

            <div>
              {!unblockingRequested ? (
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
                        {failureCount < 3 ? (
                          <>
                            <Text type={'bodySmall'} data-test={'warning-1'}>
                              Try re-typing your password, or reset your password below. If you’ve
                              forgotten your username, please{' '}
                              <Link href="">
                                <a>Contact Us</a>
                              </Link>{' '}
                              directly.
                            </Text>
                            {failureCount == 2 && (
                              <>
                                <Spacer size={2} />
                                <Text type={'bodySmall'} data-test={'warning-2'}>
                                  <b>Please note!</b> You have one more attempt before your account
                                  is blocked.
                                </Text>
                              </>
                            )}
                          </>
                        ) : (
                          <Text type={'bodySmall'} data-test={'warning-3'}>
                            Your account is now blocked. Click below to unblock it.
                          </Text>
                        )}
                        {failureCount <= 3 && (
                          <Styled.failureCount className={classNames({ final: failureCount >= 2 })}>
                            <Text type={'labelSmall'} uppercase>
                              Attempt {failureCount}/3
                            </Text>
                          </Styled.failureCount>
                        )}
                      </ErrorBox>
                    </>
                  )}

                  <Spacer size={6} />

                  {failureCount < 3 && (
                    <>
                      <Checkbox
                        id={'remember-me'}
                        label={'Remember me'}
                        isChecked={remember}
                        onChange={setRemember}
                      />

                      <Spacer size={6} />
                    </>
                  )}

                  {failureCount < 3 ? (
                    <Button data-test={'login-button'} label={'Login'} onClick={onLogin} />
                  ) : (
                    <Button
                      data-test={'unblock-button'}
                      label={'Unblock account'}
                      onClick={onUnblock}
                    />
                  )}

                  {failureCount < 3 && (
                    <>
                      <Spacer size={4} />

                      <Text type="span" center color={color.theme.blueMid}>
                        <Link href="/reset-password">
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
                    </>
                  )}
                </Box>
              ) : (
                <Box>
                  <Text type={'h4'}>Unblock Requested</Text>
                  <Spacer size={6} />
                  <Text type="bodySmall">
                    You will shortly receive an email with a link to re-validate your identity and
                    unblock your account.
                  </Text>
                  <Spacer size={4} />
                  <Text type="bodySmall">
                    You must click the complete to complete the unblocking.
                  </Text>
                </Box>
              )}

              {failureCount === 0 && !unblockingRequested && (
                <>
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
                </>
              )}
            </div>
          </Columns>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Home);
