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
import fetchJson, { CustomResponse } from '../lib/fetchJson';
import useUser from '../lib/useUser';
import { Api, BASE_URI } from '../utils/api';
import * as Validation from '../utils/validation';
import * as Styled from './index.styles';

type Errors = {
  email?: string | undefined;
  password?: string | undefined;
  form?: string | undefined;
};

interface HomeProps extends LoadingHOCProps {}

export const Home: React.FC<HomeProps> = ({ setLoading }) => {
  let storedEmail = '',
    storedPassword = '';
  storedEmail = cookieCutter.get && cookieCutter.get('dods-login-username');
  storedPassword = cookieCutter.get && cookieCutter.get('dods-login-password');
  const [emailAddress, setEmailAddress] = React.useState<string>(storedEmail);
  const [password, setPassword] = React.useState<string>(storedPassword);
  const [remember, setRemember] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [failureCount, setFailureCount] = React.useState<number>(0);
  const [unblockingRequested, setUnblockingRequested] = React.useState(false);
  const [showInactiveMsg, setShowInactiveMsg] = React.useState<boolean>(false);

  useEffect(() => {
    /* istanbul ignore next*/
    if (storedEmail && storedEmail.length > 0) {
      setRemember(true);
    }
  }, [storedEmail]);

  useEffect(() => {
    setShowInactiveMsg(false);
    setErrors({});
  }, [emailAddress, password]);

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

    return Object.keys(formErrors).length === 0;
  };

  const onLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const body = {
      email: emailAddress,
      password: password,
    };

    try {
      const user = (await fetchJson(`${BASE_URI}${Api.Login}`, {
        body: JSON.stringify(body),
      })) as CustomResponse;

      if (user.isLoggedIn) {
        await mutateUser(user);

        if (remember) {
          cookieCutter.set('dods-login-username', emailAddress);
          cookieCutter.set('dods-login-password', password);
        }
        setLoading(false);
      } else {
        if (
          user.data?.name === 'NotAuthorizedException' ||
          user.data?.name === 'UserNotFoundException'
        ) {
          if (user.data?.isActive === false) {
            setShowInactiveMsg(true);
          } else {
            setFailureCount(failureCount + 1);
          }
        } else {
          setErrors({ form: 'FAIL' });
        }
      }
    } catch (error) {
      if (
        error.data.name === 'NotAuthorizedException' ||
        error.data.name === 'UserNotFoundException'
      ) {
        if (error.data.isActive === false) {
          setShowInactiveMsg(true);
        } else {
          setFailureCount(failureCount + 1);
        }
      } else {
        setErrors({ form: 'FAIL' });
      }
    }

    setLoading(false);
  };

  const onUnblock = async () => {
    setLoading(true);

    try {
      await fetchJson(`${BASE_URI}${Api.EnableUser}`, {
        body: JSON.stringify({ email: emailAddress }),
      });
      setFailureCount(0);
      setUnblockingRequested(true);
      setLoading(false);
    } catch (error) {
      setErrors({ form: 'FAIL' });
      setLoading(false);
    }
  };

  return (
    <div data-test="page-home">
      <Head>
        <title>Dods | Welcome to Dods</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Panel isWelcome isNarrow>
          <Columns isWelcome>
            <div>
              <Text type={'h1'} headingStyle="heroExtraLarge">
                Political Intelligence Platform
              </Text>
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

                  {showInactiveMsg && (
                    <>
                      <Spacer size={4} />
                      <ErrorBox data-test={'failure-count'}>
                        <Text type={'bodySmall'} bold>
                          Account inactive
                        </Text>
                        <Spacer size={2} />
                        <Text type={'bodySmall'}>
                          Contact your account consultant to restore access
                        </Text>
                      </ErrorBox>
                    </>
                  )}

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
                <Box data-test="unblock-confirmation">
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
            </div>
          </Columns>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Home);
