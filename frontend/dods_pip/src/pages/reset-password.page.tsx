import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import InputText from '../components/_form/InputText';
import Box from '../components/_layout/Box';
import Columns from '../components/_layout/Columns';
import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import Button from '../components/Button';
import Text from '../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';
import fetchJson from '../lib/fetchJson';
import * as Validation from '../utils/validation';

type Errors = {
  email?: string | undefined;
  form?: string | undefined;
};

interface ResetPasswordProps extends LoadingHOCProps {}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ setLoading }) => {
  const [emailAddress, setEmailAddress] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Errors>({});
  const [requested, setRequested] = React.useState<boolean>(false);

  const validateForm = () => {
    const formErrors = { ...errors };

    if (!Validation.validateRequired(emailAddress)) {
      formErrors.email = 'Email address is required';
    } else if (!Validation.validateEmail(emailAddress)) {
      formErrors.email = 'Invalid format';
    } else {
      delete formErrors.email;
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const onReset = async () => {
    setLoading(true);

    if (validateForm()) {
      try {
        await fetchJson('/api/forgotPassword', {
          body: JSON.stringify({ email: emailAddress }),
        });

        setRequested(true);
        setLoading(false);
      } catch (error) {
        setErrors({ form: 'FAIL' });
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div data-test="page-reset-password">
      <Head>
        <title>Dods PIP | Password Reset Request</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Panel isWelcome>
          <Columns>
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
              {!requested ? (
                <Box data-test="reset-request">
                  <Text type={'h4'}>Reset Password</Text>
                  <Spacer size={4} />
                  <InputText
                    data-test={'reset-email'}
                    id="reset-email"
                    label={'Your email'}
                    value={emailAddress}
                    onChange={setEmailAddress}
                    error={errors.email}
                    helperText={'Please enter your email'}
                  />
                  <Spacer size={10} />
                  <Button
                    data-test={'form-button'}
                    label={'Send recovery link'}
                    onClick={onReset}
                  />
                  <Spacer size={4} />
                  <Text type="bodySmall" center>
                    If you’ve forgotten your username, please{' '}
                    <Link href="">
                      <a>Contact Us</a>
                    </Link>{' '}
                    directly.
                  </Text>
                </Box>
              ) : (
                <Box data-test="reset-confirmation">
                  <Text type={'h4'}>We’ve sent you a link to reset your password. </Text>

                  <Spacer size={6} />

                  <Text>Please check your email and follow the instructions.</Text>
                </Box>
              )}
            </div>
          </Columns>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(ResetPassword);
