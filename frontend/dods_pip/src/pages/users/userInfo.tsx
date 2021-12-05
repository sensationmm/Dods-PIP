import { format } from 'date-fns';
import { useRouter } from 'next/router';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Avatar from '../../components/Avatar';
import Breadcrumbs from '../../components/Breadcrumbs';
import Icon, { IconSize } from '../../components/Icon';
import { Icons } from '../../components/Icon/assets';
import Loader from '../../components/Loader';
import Text from '../../components/Text';
import color from '../../globals/color';
import { LoadingHOCProps } from '../../hoc/LoadingHOC';
import useUser, { User } from '../../lib/useUser';
import * as AccountStyled from '../accounts/index.styles';
import Summary from '../accounts/summary';
import * as Styled from './userInfo.styles';

export interface UserInfoProps {
  userData: User | undefined;
  addNotification: LoadingHOCProps['addNotification'];
  setLoading: LoadingHOCProps['setLoading'];
  actions: JSX.Element[];
  isDodsUser?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({
  userData,
  addNotification,
  setLoading,
  actions,
  isDodsUser = false,
}) => {
  const { user } = useUser({ redirectTo: '/' });
  const router = useRouter();

  const { id } = router.query;

  const userActive = userData?.isActive === 1 ? true : false;

  const breadcrumb = [
    {
      href: `/accounts/${userData?.clientAccount?.uuid}`,
      label: userData?.clientAccountName || userData?.clientAccount?.name || '',
    },
    { href: router.pathname, label: userData?.displayName || '' },
  ];

  if (user?.isDodsUser) {
    breadcrumb.unshift({ href: '/account-management/accounts', label: 'Accounts' });
  }

  return (
    <>
      <Panel bgColor={color.base.ivory}>
        {userData !== undefined ? (
          <>
            {!userData.isDodsUser && (
              <>
                <Breadcrumbs history={breadcrumb} />

                <Spacer size={8} />
              </>
            )}

            <Styled.headerOuter>
              <Styled.header>
                <Avatar type={userData?.isDodsUser ? 'consultant' : 'client'} />
                <Text type={'h1'} headingStyle="hero">
                  {userData?.displayName}
                </Text>
              </Styled.header>
              <Styled.actions>{actions}</Styled.actions>
            </Styled.headerOuter>

            <Spacer size={16} />

            <AccountStyled.sumAccountWrapper padded={false}>
              <AccountStyled.sumIconTitle>
                <Icon src={Icons.Person} size={IconSize.xlarge} />
                <Text type="h3" headingStyle="title">
                  Primary
                </Text>
              </AccountStyled.sumIconTitle>
              <AccountStyled.sumAccountContentDetails>
                <AccountStyled.sumAccountContentGrid>
                  <div>
                    <Text type="body" bold={true}>
                      Client Name
                    </Text>
                    <Text>{userData?.displayName}</Text>
                  </div>
                  <div>
                    <Text type="body" bold={true}>
                      Job Title
                    </Text>
                    <Text>{userData.title}</Text>
                  </div>
                  <div>
                    <Text type="body" bold={true}>
                      Member since
                    </Text>
                    <Text>{format(new Date(userData?.memberSince), 'dd/LL/yyyy')}</Text>
                  </div>
                  <div>
                    <Text type="body" bold={true}>
                      Status
                    </Text>
                    <Text bold color={userActive ? color.alert.green : color.alert.red}>
                      {userActive ? 'Active' : 'Inactive'}
                    </Text>
                  </div>
                </AccountStyled.sumAccountContentGrid>
                {isDodsUser && (
                  <>
                    <Spacer size={8} />
                    <AccountStyled.sumAccountContentNotes>
                      <Text type="body" bold={true}>
                        User ID
                      </Text>
                      <Text>{id}</Text>
                    </AccountStyled.sumAccountContentNotes>
                  </>
                )}
              </AccountStyled.sumAccountContentDetails>
              <div />
            </AccountStyled.sumAccountWrapper>

            <Spacer size={12} />
            <hr />
            <Spacer size={12} />

            <AccountStyled.sumAccountWrapper padded={false}>
              <AccountStyled.sumIconTitle>
                <Icon src={Icons.Mail} size={IconSize.xlarge} />
                <Text type="h3" headingStyle="title">
                  Contact details
                </Text>
              </AccountStyled.sumIconTitle>
              <AccountStyled.sumAccountContentDetails>
                <AccountStyled.sumAccountContentGrid>
                  {userData.primaryEmail && (
                    <div>
                      <Text type="body" bold={true}>
                        Email #1
                      </Text>
                      <Text>
                        <a href={`mailto:${userData.primaryEmail}`}>{userData.primaryEmail}</a>
                      </Text>
                    </div>
                  )}
                  {userData.secondaryEmail && (
                    <div>
                      <Text type="body" bold={true}>
                        Email #2
                      </Text>
                      <Text>
                        <a href={`mailto:${userData.secondaryEmail}`}>{userData.secondaryEmail}</a>
                      </Text>
                    </div>
                  )}
                  {userData.telephoneNumber1 && (
                    <div>
                      <Text type="body" bold={true}>
                        Telephone #1
                      </Text>
                      <Text>
                        <a href={`tel:${userData.telephoneNumber1}`}>{userData.telephoneNumber1}</a>
                      </Text>
                    </div>
                  )}
                  {userData.telephoneNumber2 && (
                    <div>
                      <Text type="body" bold={true}>
                        Telephone #2
                      </Text>
                      <Text>
                        <a href={`tel:${userData.telephoneNumber2}`}>{userData.telephoneNumber2}</a>
                      </Text>
                    </div>
                  )}
                </AccountStyled.sumAccountContentGrid>
              </AccountStyled.sumAccountContentDetails>
              <div />
            </AccountStyled.sumAccountWrapper>
          </>
        ) : (
          <AccountStyled.loader>
            <Loader inline />
          </AccountStyled.loader>
        )}
      </Panel>

      <hr />

      {userData?.clientAccount?.uuid && !userData?.isDodsUser && (
        <Panel>
          <Summary
            accountId={userData?.clientAccount?.uuid}
            addNotification={addNotification}
            setLoading={setLoading}
            editable={false}
          />
        </Panel>
      )}
    </>
  );
};

export default UserInfo;
