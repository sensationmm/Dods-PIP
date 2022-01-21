import Checkbox from '@dods-ui/components/_form/Checkbox';
import InputSearch from '@dods-ui/components/_form/InputSearch';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Avatar from '@dods-ui/components/Avatar';
import Badge from '@dods-ui/components/Badge';
import Button from '@dods-ui/components/Button';
import { PlainTable } from '@dods-ui/components/DataTable';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Modal from '@dods-ui/components/Modal';
import Pagination from '@dods-ui/components/Pagination';
import TagSelector from '@dods-ui/components/TagSelector';
import Text from '@dods-ui/components/Text';
import { DropdownValue } from '@dods-ui/pages/account-management/add-client/type';
import React from 'react';

import { AlertStepProps } from './alert-setup';
import * as Styled from './alert-setup.styles';

const AlertStep3: React.FC<AlertStepProps> = () => {
  const [filter, setFilter] = React.useState<string>('');
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [showRemove, setShowRemove] = React.useState<boolean>(false);
  const [newUsers, setNewUsers] = React.useState<DropdownValue[]>([]);

  const { PaginationButtons, PaginationStats } = Pagination(5, '5');

  return (
    <>
      <Styled.sectionHeaderContainer>
        <Styled.sectionHeader>
          <Icon src={Icons.Users} size={IconSize.xxlarge} />
          <Text type="h2" headingStyle="title">
            Recipients
          </Text>
          <Badge number={5} label="Recipients" size="small" />
        </Styled.sectionHeader>

        <Styled.sectionHeader>
          <InputSearch
            size="medium"
            id="filter"
            placeholder="Filter by user or account"
            value={filter}
            onChange={setFilter}
          />
          <Button
            type="secondary"
            label="Add Recipients"
            icon={Icons.Add}
            iconAlignment="right"
            onClick={() => setShowAdd(true)}
          />
        </Styled.sectionHeader>
      </Styled.sectionHeaderContainer>

      <Spacer size={8} />

      <PlainTable
        headings={['Name', 'Account', 'Active', '']}
        colWidths={[7, 5, 1, 2]}
        rows={[
          [
            '12345',
            <Styled.sectionHeader key="title1">
              <Avatar type="client" size="small" />
              <Text bold>John Lewis</Text>
            </Styled.sectionHeader>,
            <>
              <Text>Account header</Text>
            </>,
            <>
              <Checkbox id="active1" isChecked onChange={console.log} />
            </>,
            <>
              <Button
                type="text"
                label="Remove"
                icon={Icons.Bin}
                onClick={() => setShowRemove(true)}
              />
            </>,
          ],
          [
            '12345',
            <Styled.sectionHeader key="title2">
              <Avatar type="client" size="small" />
              <Text bold>John Lewis</Text>
            </Styled.sectionHeader>,
            <>
              <Text>Account header</Text>
            </>,
            <>
              <Checkbox id="active2" isChecked onChange={console.log} />
            </>,
            <>
              <Button
                type="text"
                label="Remove"
                icon={Icons.Bin}
                onClick={() => setShowRemove(true)}
              />
            </>,
          ],
          [
            '12345',
            <Styled.sectionHeader key="title3">
              <Avatar type="client" size="small" />
              <Text bold>John Lewis</Text>
            </Styled.sectionHeader>,
            <>
              <Text>Account header</Text>
            </>,
            <>
              <Checkbox id="active3" isChecked onChange={console.log} />
            </>,
            <>
              <Button
                type="text"
                label="Remove"
                icon={Icons.Bin}
                onClick={() => setShowRemove(true)}
              />
            </>,
          ],
          [
            '12345',
            <Styled.sectionHeader key="title4">
              <Avatar type="client" size="small" />
              <Text bold>John Lewis</Text>
            </Styled.sectionHeader>,
            <>
              <Text>Account header</Text>
            </>,
            <>
              <Checkbox id="active4" isChecked onChange={console.log} />
            </>,
            <>
              <Button
                type="text"
                label="Remove"
                icon={Icons.Bin}
                onClick={() => setShowRemove(true)}
              />
            </>,
          ],
          [
            '12345',
            <Styled.sectionHeader key="title5">
              <Avatar type="client" size="small" />
              <Text bold>John Lewis</Text>
            </Styled.sectionHeader>,
            <>
              <Text>Account header</Text>
            </>,
            <>
              <Checkbox id="active5" isChecked onChange={console.log} />
            </>,
            <>
              <Button
                type="text"
                label="Remove"
                icon={Icons.Bin}
                onClick={() => setShowRemove(true)}
              />
            </>,
          ],
        ]}
        emptyMessage="You need to do at least one recipient"
        emptyAction={
          <Button
            type="text"
            label="Add Recipients"
            icon={Icons.Add}
            iconAlignment="right"
            onClick={() => setShowAdd(true)}
          />
        }
      />
      <Spacer size={5} />
      <PaginationStats>
        <PaginationButtons />
      </PaginationStats>

      {showAdd && (
        <Modal
          title="Add new recipients"
          size="xlarge"
          onClose={() => setShowAdd(false)}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Cancel',
              onClick: () => setShowAdd(false),
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Add to alert',
              icon: Icons.Add,
              onClick: () => setShowAdd(false),
            },
          ]}
          buttonAlignment="right"
        >
          <TagSelector
            id="add-recipients"
            title="Search and add users in bulk"
            placeholder="Start typing to search"
            helperText="Click on the person or account to add them to this list"
            values={newUsers}
            emptyMessage=""
            onChange={(val) => setNewUsers(val as DropdownValue[])}
          />
        </Modal>
      )}

      {showRemove && (
        <Modal
          title="Do you wish to remove?"
          titleIcon={Icons.Bin}
          size="large"
          onClose={() => setShowRemove(false)}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Back',
              onClick: () => setShowRemove(false),
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Confirm and remove',
              icon: Icons.Bin,
              onClick: () => setShowRemove(false),
            },
          ]}
          buttonAlignment="right"
        >
          <Text>This user will be removed from this alert</Text>
        </Modal>
      )}
    </>
  );
};

export default AlertStep3;
