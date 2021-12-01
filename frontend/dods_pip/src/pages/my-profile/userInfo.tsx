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
import { User } from '../../lib/useUser';
import * as AccountStyled from '../accounts/index.styles';
import Summary from '../accounts/summary';
import * as Styled from './index.styles';

export interface UserInfoProps {
  user: User | undefined;
  addNotification: LoadingHOCProps['addNotification'];
  setLoading: LoadingHOCProps['setLoading'];
  actions: JSX.Element[];
  isDodsUser?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({
  user,
  addNotification,
  setLoading,
  actions,
  isDodsUser = false,
}) => {
  return (
    <>
      <Panel bgColor={color.base.ivory}>
        {user !== undefined ? (
          <>
            <Breadcrumbs history={[{ href: '/accounts', label: 'Accounts' }]} />

            <Spacer size={8} />
            <Styled.headerOuter>
              <Styled.header>
                <Avatar type={user?.isDodsUser ? 'consultant' : 'client'} />
                <Text type={'h1'} headingStyle="hero">
                  {user?.displayName}
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
                    <Text>{user?.displayName}</Text>
                  </div>
                  <div>
                    <Text type="body" bold={true}>
                      Job Title
                    </Text>
                    <Text></Text>
                  </div>
                  <div>
                    <Text type="body" bold={true}>
                      Member since
                    </Text>
                    <Text></Text>
                  </div>
                  <div>
                    <Text type="body" bold={true}>
                      Status
                    </Text>
                    <Text bold color={color.alert.green}>
                      Active
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
                      <Text></Text>
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
                  <div>
                    <Text type="body" bold={true}>
                      Email #1
                    </Text>
                    <Text></Text>
                  </div>
                  <div>
                    <Text type="body" bold={true}>
                      Email #2
                    </Text>
                    <Text></Text>
                  </div>
                  <div>
                    <Text type="body" bold={true}>
                      Telephone #1
                    </Text>
                    <Text></Text>
                  </div>
                  <div>
                    <Text type="body" bold={true}>
                      Telephone #2
                    </Text>
                    <Text></Text>
                  </div>
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

      {user?.clientAccountId && !user?.isDodsUser && (
        <Panel>
          <Summary
            accountId={user?.clientAccountId}
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
