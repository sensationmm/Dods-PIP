import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import InputPassword from '../components/_form/InputPassword';
import Box from '../components/_layout/Box';
import Columns from '../components/_layout/Columns';
import ErrorBox from '../components/_layout/ErrorBox';
import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import Button from '../components/Button';
import PasswordStrength, { PasswordStrengthProps } from '../components/PasswordStrength';
import Text from '../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';
import * as Validation from '../utils/validation';

type Errors = {
  password?: string | undefined;
  passwordConfirm?: string | undefined;
};

interface PasswordResetProps extends LoadingHOCProps {}

export const PasswordReset: React.FC<PasswordResetProps> = ({ setLoading }) => {
  const router = useRouter();
  const [password, setPassword] = React.useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Errors>({});
  const [confirmed, setConfirmed] = React.useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = React.useState<PasswordStrengthProps>({});
  const [isRepeatPassword] = React.useState<boolean>(false);

  const validateForm = () => {
    const formErrors = { ...errors };

    if (!Validation.validateRequired(password)) {
      formErrors.password = 'Password is required';
    } else if (!Validation.validatePassword(password).valid) {
      formErrors.password = 'Password must meet all criteria';
    } else {
      delete formErrors.password;
    }

    if (!Validation.validateRequired(passwordConfirm)) {
      formErrors.passwordConfirm = 'Confirm password is required';
    } else if (!Validation.validateMatching(passwordConfirm, password)) {
      formErrors.passwordConfirm = 'Passwords must match';
    } else {
      delete formErrors.passwordConfirm;
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const onConfirm = () => {
    setLoading(true);

    if (validateForm() && !isRepeatPassword) {
      setConfirmed(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <div data-test="page-password-reset">
      <Head>
        <title>Dods PIP | Reset your password</title>
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
              {!confirmed ? (
                <Box data-test="reset-request">
                  <Text type={'h4'}>Create a new password</Text>

                  <Spacer size={6} />

                  <InputPassword
                    data-test={'reset-password'}
                    id="reset-password"
                    label={'Password'}
                    value={password}
                    error={errors.password}
                    helperText={'Create a unique password'}
                    onChange={(val) => {
                      setPassword(val);
                      setPasswordStrength(Validation.validatePassword(val).results);
                    }}
                  />

                  <Spacer size={4} />

                  <InputPassword
                    data-test={'reset-password-confirm'}
                    id="reset-password-confirm"
                    label={'Confirm password'}
                    value={passwordConfirm}
                    onChange={setPasswordConfirm}
                    error={errors.passwordConfirm}
                    helperText={'Re-type the password'}
                  />

                  <Spacer size={6} />

                  <PasswordStrength disabled={!password} {...passwordStrength} />

                  {isRepeatPassword && (
                    <>
                      <Spacer size={4} />
                      <ErrorBox data-test="repeat-password-warning">
                        <Text type={'bodySmall'} bold>
                          You can’t use this password
                        </Text>
                        <Spacer size={2} />
                        <Text type={'bodySmall'}>
                          You need to set a unique password that hasn’t previously been used in the
                          last [X amount of time].
                        </Text>
                      </ErrorBox>
                    </>
                  )}

                  <Spacer size={6} />

                  <Button data-test={'form-button'} label={'Save Changes'} onClick={onConfirm} />
                </Box>
              ) : (
                <Box data-test="reset-confirmation">
                  <Text type={'h4'}>Your password is now updated!</Text>

                  <Spacer size={12} />

                  <Button
                    data-test={'button-back-to-login'}
                    label={'Go to Login'}
                    onClick={() => router.push('/')}
                  />
                </Box>
              )}
            </div>
          </Columns>
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(PasswordReset);
