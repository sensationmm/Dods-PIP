import InputSearch from '@dods-ui/components/_form/InputSearch';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Avatar, { UserType } from '@dods-ui/components/Avatar';
import Badge from '@dods-ui/components/Badge';
import Button from '@dods-ui/components/Button';
import { PlainTable } from '@dods-ui/components/DataTable';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Modal from '@dods-ui/components/Modal';
import TagSelector from '@dods-ui/components/TagSelector';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import fetchJson, { CustomResponse } from '@dods-ui/lib/fetchJson';
import { DropdownValue } from '@dods-ui/pages/account-management/add-client/type';
import { UserAccount } from '@dods-ui/pages/account-management/users.page';
import { Api, BASE_URI } from '@dods-ui/utils/api';
import { getUserName } from '@dods-ui/utils/string';
import { debounce } from 'lodash';
import React, { useMemo } from 'react';

import { AlertStepProps } from './alert-setup';
import * as Styled from './alert-setup.styles';

const AlertStep3: React.FC<AlertStepProps> = ({
  alert,
  setActiveStep,
  editAlert,
  disabled = false,
}) => {
  const [filter, setFilter] = React.useState<string>('');
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [showRemove, setShowRemove] = React.useState<boolean>(false);
  const [userResults, setUserResults] = React.useState<DropdownValue[]>([]);
  const [newRecipients, setNewRecipients] = React.useState<DropdownValue[]>([]);
  const [recipients, setRecipients] = React.useState<DropdownValue[]>(
    alert.recipients && alert.recipients.length > 0 ? alert.recipients : [],
  );
  const [deleteTarget, setDeleteTarget] = React.useState<string>('');
  const [changed, setChanged] = React.useState<boolean>(false);

  const debounceSearchUsers = debounce(async (name: string) => {
    try {
      let url = `${BASE_URI}${Api.Users}?clientAccountId=${alert.accountId}`;
      if (name !== '') {
        url += `&name=${name}`;
      }
      const response = await fetchJson<CustomResponse>(url, {
        method: 'GET',
      });
      const { success = false, data = [] } = response;

      if (success && Array.isArray(data)) {
        const values = data
          .filter(
            (item: UserAccount) => recipients.map((item) => item.value).indexOf(item.uuid) === -1,
          )
          .filter((item: UserAccount) => item.isActive)
          .map((item: UserAccount) => ({
            value: item.uuid,
            label: getUserName(item),
            icon: item.isDodsUser ? 'consultant' : 'client',
            userData: {
              accountName: item.clientAccount.name as string,
              isActive: item.isActive,
            },
          }));

        setUserResults(values);
      }
    } catch (e) {
      console.log(e);
    }
  }, 150);

  const searchUsers = useMemo(() => debounceSearchUsers, []);

  React.useEffect(() => {
    searchUsers('');
  }, []);

  const reset = () => {
    setUserResults([]);
    setNewRecipients([]);
  };

  const onDelete = (id: string) => {
    setShowRemove(true);
    setDeleteTarget(id);
  };

  const handleDelete = () => {
    setRecipients(recipients.filter((rec) => rec.value !== deleteTarget));
    setShowRemove(false);
    setDeleteTarget('');
    setChanged(true);
  };

  return (
    <>
      <Styled.sectionHeaderContainer>
        <Styled.sectionHeader>
          <Icon src={Icons.Users} size={IconSize.xxlarge} />
          <Text type="h2" headingStyle="title">
            Recipients
          </Text>
          <Badge number={recipients.length} label="Recipients" size="small" />
        </Styled.sectionHeader>

        <Styled.sectionHeader>
          <InputSearch
            size="medium"
            id="filter"
            placeholder="Filter by user or account"
            value={filter}
            onChange={setFilter}
          />
          {!disabled && (
            <Button
              type="secondary"
              label="Add Recipients"
              icon={Icons.Add}
              iconAlignment="right"
              onClick={() => setShowAdd(true)}
            />
          )}
        </Styled.sectionHeader>
      </Styled.sectionHeaderContainer>

      <Spacer size={8} />

      <PlainTable
        headings={['Name', 'Account', '']}
        colWidths={[7, 5, 1, 2]}
        rows={recipients
          .filter(
            (recipient) =>
              recipient.label.toLowerCase().search(filter.toLowerCase()) > -1 ||
              (recipient.userData?.accountName as string)
                .toLowerCase()
                .search(filter.toLowerCase()) > -1,
          )
          .map((recipient) => [
            recipient.value,
            <Styled.sectionHeader key="title1">
              <Avatar
                type={recipient.icon as UserType}
                size="small"
                disabled={recipient?.userData?.isActive === 0}
              />
              <Text
                bold
                color={recipient.userData?.isActive === 0 ? color.base.grey : color.theme.blue}
              >
                {recipient.label}
              </Text>
            </Styled.sectionHeader>,
            <>
              <Text>{recipient.userData?.accountName as string}</Text>
            </>,
            /*<>
              <Checkbox
                id={`active-${count}`}
                isDisabled
                isChecked={recipient.userData?.isActive === 1}
                onChange={console.log}
              />
            </>,*/
            <>
              {!disabled && (
                <Button
                  type="text"
                  label="Remove"
                  icon={Icons.Bin}
                  onClick={() => onDelete(recipient.value)}
                />
              )}
            </>,
          ])}
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

      {!disabled && (
        <>
          <Spacer size={15} />

          <Styled.actions>
            <Button
              type="text"
              inline
              label="Back"
              icon={Icons.ChevronLeftBold}
              onClick={() => setActiveStep(2)}
            />
            <Button
              inline
              label={'Next'}
              icon={Icons.ChevronRightBold}
              iconAlignment="right"
              onClick={() => (!changed ? setActiveStep(4) : editAlert && editAlert(recipients))}
              disabled={recipients.length === 0}
            />
          </Styled.actions>
        </>
      )}

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
              onClick: () => {
                reset();
                setShowAdd(false);
              },
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Add to alert',
              icon: Icons.Add,
              onClick: () => {
                reset();
                setRecipients([...recipients, ...newRecipients]);
                setShowAdd(false);
                setChanged(true);
              },
              disabled: newRecipients.length === 0,
            },
          ]}
          buttonAlignment="right"
          bodyOverflow
        >
          <TagSelector
            id="add-recipients"
            title="Search and add users in bulk"
            placeholder="Start typing to search"
            helperText="Click on the person or account to add them to this list"
            values={userResults}
            onKeyPress={searchUsers}
            emptyMessage=""
            onChange={(val) => setNewRecipients(val as DropdownValue[])}
            selectedValues={newRecipients}
            isFilter
          />
        </Modal>
      )}

      {showRemove && (
        <Modal
          title="Do you wish to remove?"
          titleIcon={Icons.Bin}
          size="large"
          onClose={() => {
            setShowRemove(false);
            setDeleteTarget('');
          }}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Back',
              onClick: () => {
                setShowRemove(false);
                setDeleteTarget('');
              },
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Confirm and remove',
              icon: Icons.Bin,
              onClick: handleDelete,
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
