import React from 'react';

import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { PlainTable } from '../../components/DataTable';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icon/assets';
import SectionAccordion from '../../components/SectionAccordion';
import Text from '../../components/Text';
import * as Styled from './index.styles';

export interface UsersProps {
  accountId: string;
}

const Users: React.FC<UsersProps> = ({ accountId }) => {
  const usersComplete: {
    name: string;
    type: string;
    role?: string;
    access?: string;
    email?: string;
    email2?: string;
    telephone?: string;
    telephone2?: string;
  }[] = [];

  return (
    <Styled.sumWrapper>
      <SectionAccordion
        header={
          <Styled.sectionCustomHeader>
            <Text type="h2" headingStyle="titleLarge">
              User
            </Text>
            <Styled.badgeContainer>
              <Badge size="small" label="Seats allowance" number={10} />
              <Badge size="small" label="Seats reaming" number={7} />
              <Badge size="small" label="Active users" number={3} />
              <Badge size="small" label="Inactive users" number={0} />
            </Styled.badgeContainer>
            <Button
              type="secondary"
              label="Add User"
              icon={Icons.Add}
              iconAlignment="right"
              onClick={(e) => e.stopPropagation()}
            />
          </Styled.sectionCustomHeader>
        }
        isOpen={true}
      >
        <PlainTable
          headings={['Name', 'Email', 'Role', '']}
          colWidths={[4, 3, 2, 1]}
          rows={usersComplete.map((user) => {
            return [
              accountId,
              <Styled.sumAvatarName key={`team-${user.name}`}>
                <Avatar type="client" size="small" alt={user.name} />
                <Text bold={true}>{user.name}</Text>
              </Styled.sumAvatarName>,
              <Text key={`${user.name}-email`}>
                <a key={user.name} href={'mailto:' + user.email}>
                  {user.email}
                </a>
              </Text>,
              <Text key={`${user.name}-role`}>{user.role}</Text>,
              <Icon key={`${user.name}-link`} src={Icons.ChevronRightBold} />,
            ];
          })}
        />
        <Styled.sumUserNav>
          <Text type="bodySmall">Total 3 Items</Text>
          <Text type="bodySmall">Viewing page 1 of 1</Text>
          <Text type="bodySmall">Items perpage 10</Text>
        </Styled.sumUserNav>
      </SectionAccordion>
    </Styled.sumWrapper>
  );
};

export default Users;
