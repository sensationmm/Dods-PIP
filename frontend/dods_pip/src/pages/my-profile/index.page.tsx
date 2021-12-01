import Head from 'next/head';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { PlainTable } from '../../components/DataTable';
import { Icons } from '../../components/Icon/assets';
import IconButton from '../../components/IconButton';
import Modal from '../../components/Modal';
import SectionAccordion from '../../components/SectionAccordion';
import Text from '../../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import useUser from '../../lib/useUser';
import { Api, BASE_URI } from '../../utils/api';
import { teamList as TeamList } from '../account-management/accounts.styles';
import * as AccountStyled from '../accounts/index.styles';
import UserInfo from './userInfo';

interface MyProfileProps extends LoadingHOCProps {}

export const MyProfile: React.FC<MyProfileProps> = ({ setLoading, addNotification }) => {
  const { user } = useUser({ redirectTo: '/' });
  const [showReset, setShowReset] = React.useState<boolean>(false);

  const onReset = async () => {
    setShowReset(false);
    setLoading(true);

    try {
      await fetchJson(`${BASE_URI}${Api.ForgotPassword}`, {
        body: JSON.stringify({ email: 'kevin.reynolds1+user@gmail.com' }),
      });

      addNotification({
        title: 'We’ve sent you a link to reset your password. ',
        text: 'Please check your email and follow the instructions.',
        type: 'confirm',
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div data-test="page-my-profile">
      <Head>
        <title>Dods PIP | My Profile</title>
      </Head>

      <main>
        <UserInfo
          user={user}
          addNotification={addNotification}
          setLoading={setLoading}
          actions={[
            <Button
              key="button-reset"
              type="secondary"
              label="Reset password"
              icon={Icons.Refresh}
              onClick={() => setShowReset(true)}
            />,
          ]}
        />

        {user?.isDodsUser && (
          <Panel>
            <AccountStyled.sumWrapper>
              <SectionAccordion
                header={
                  <AccountStyled.sectionCustomHeader>
                    <Text type="h2" headingStyle="titleLarge">
                      Accounts assigned
                    </Text>
                    <AccountStyled.badgeContainer>
                      <Badge size="small" label="Accounts assigned" number={0} />
                    </AccountStyled.badgeContainer>
                  </AccountStyled.sectionCustomHeader>
                }
                isOpen={true}
              >
                <PlainTable
                  headings={['Name', 'Subscription', 'Collections', 'Users', '']}
                  colWidths={[4, 2, 2, 3, 1]}
                  rows={[
                    [
                      '',
                      <Text key="name-1" bold>
                        Account name
                      </Text>,
                      <Text key="subscription-1">Silver</Text>,
                      <Text key="collections-1">5</Text>,
                      <TeamList key={`row-1`}>
                        <Avatar size="small" type="client" />
                        <Avatar size="small" type="consultant" />
                        <Avatar size="small" type="client" />
                      </TeamList>,
                      <IconButton
                        key={`button-1`}
                        isSmall
                        onClick={() => console.log('account clicked')}
                        icon={Icons.ChevronRightBold}
                        type="text"
                      />,
                    ],
                    [
                      '',
                      <Text key="name-2" bold>
                        Account name
                      </Text>,
                      <Text key="subscription-2">Silver</Text>,
                      <Text key="collections-2">5</Text>,
                      <TeamList key={`row-2`}>
                        <Avatar size="small" type="client" />
                        <Avatar size="small" type="consultant" />
                        <Avatar size="small" type="client" />
                      </TeamList>,
                      <IconButton
                        key={`button-2`}
                        isSmall
                        onClick={() => console.log('account clicked')}
                        icon={Icons.ChevronRightBold}
                        type="text"
                      />,
                    ],
                  ]}
                />
                <Spacer size={5} />
              </SectionAccordion>
            </AccountStyled.sumWrapper>
          </Panel>
        )}
      </main>

      {showReset && (
        <Modal
          size="large"
          title="Do you wish to reset your password?"
          onClose={() => setShowReset(false)}
          buttons={[
            { isSmall: true, type: 'secondary', label: 'Back', onClick: () => setShowReset(false) },
            {
              isSmall: true,
              type: 'primary',
              label: 'Confirm',
              onClick: onReset,
              icon: Icons.ChevronRight,
              iconAlignment: 'right',
            },
          ]}
          buttonAlignment="right"
        >
          <Text type="bodyLarge">
            We will send you an email with instructions to create a new password.
          </Text>
        </Modal>
      )}
    </div>
  );
};

export default LoadingHOC(MyProfile);
