import InputText from '@dods-ui/components/_form/InputText';
import SearchDropdown from '@dods-ui/components/_form/SearchDropdown';
import { SelectProps } from '@dods-ui/components/_form/Select';
import Avatar from '@dods-ui/components/Avatar';
import IconButton from '@dods-ui/components/IconButton';
import Modal from '@dods-ui/components/Modal';
import fetchJson, { CustomResponse } from '@dods-ui/lib/fetchJson';
import useUser, { User } from '@dods-ui/lib/useUser';
import loadAccounts from '@dods-ui/pages/accounts/load-accounts';
import { Api, BASE_URI } from '@dods-ui/utils/api';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Spacer from '../../components/_layout/Spacer';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { PlainTable } from '../../components/DataTable';
import { Icons } from '../../components/Icon/assets';
import Pagination from '../../components/Pagination';
import SectionAccordion from '../../components/SectionAccordion';
import Text from '../../components/Text';
import { ClientAccount } from '../account-management/accounts.page';
import * as Styled from './index.styles';

export type Collection = {
  uuid: string;
  name: string;
  clientAccount: Pick<ClientAccount, 'uuid' | 'name'>;
  createdAt: Date;
  createdBy: {
    name: string;
    uuid: string;
    isDodsUser: boolean;
  };
  updatedAt: Date;
  alertsCount: number;
  queriesCount: number;
  documentsCount: number;
};

export type Collections = Collection[];

export interface CollectionsProps {
  accountId: string;
  canAddCollection?: boolean;
  user?: User;
}

enum DateFormat {
  API = 'd MMMM yyyy',
}

type Errors = {
  title?: string;
  account?: string;
};

const Collections: React.FC<CollectionsProps> = ({ accountId, canAddCollection = true }) => {
  const { user } = useUser({ redirectTo: '/' });
  const [collectionsList, setCollectionsList] = React.useState<Collections>([]);
  const [filteredCollectionsList, setFilteredCollectionsList] = React.useState<Collections>([]);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [addTitle, setAddTitle] = React.useState<string>('');
  const [addAccount, setAddAccount] = React.useState<string>('');
  const [accounts, setAccounts] = React.useState<SelectProps['options']>([]);
  const [errors, setErrors] = React.useState<Errors>({});
  const router = useRouter();

  const isComplete = addAccount !== '' && addTitle != '';

  const loadCollections = async () => {
    if (accountId === '') {
      return false;
    }

    try {
      const url = `${BASE_URI}${Api.Collections}/${accountId}`;

      // Get collections
      const result = await fetchJson<CustomResponse>(url, {
        method: 'GET',
      });

      const { data = [] } = result;
      setCollectionsList(data as Collections);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    loadCollections();
  }, [accountId]);

  const filteredCollectionsTable = () => {
    const totalOfElements = activePage * numPerPage;
    const lastIndex = totalOfElements + numPerPage;
    const currentItems = collectionsList.slice(totalOfElements, lastIndex);
    if (currentItems.length > 0) {
      setFilteredCollectionsList(currentItems);
    }
  };

  const customStatsOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
  ];

  const { PaginationButtons, PaginationStats, activePage, numPerPage } = Pagination(
    collectionsList.length,
    '5',
    customStatsOptions,
    false,
  );

  React.useEffect(() => {
    filteredCollectionsTable();
  }, [activePage, collectionsList, numPerPage]);

  const createCollection = async () => {
    try {
      await fetchJson(`${BASE_URI}${Api.Collections}`, {
        method: 'POST',
        body: JSON.stringify({
          clientAccountId: addAccount,
          name: addTitle,
          createdById: user.id,
        }),
      });
      setShowAdd(false);
      await loadCollections();
      setAddTitle('');
      setAddAccount('');
    } catch {
      console.log('FAIL createCollection');
    }
  };

  const cancelCreateCollection = () => {
    setShowAdd(false);
    setAddTitle('');
    setAddAccount('');
  };

  React.useEffect(() => {
    if (user?.clientAccountId) {
      if (user?.isDodsUser) {
        loadAccounts(setAccounts);
      } else {
        setAddAccount(user.clientAccountId);
      }
    }
  }, [user]);

  const validateField = (field: keyof Errors, label: string, value: string) => {
    const formErrors = { ...errors };
    if (value === '') {
      formErrors[field] = `${label} is required`;
    } else {
      delete formErrors[field];
    }
    setErrors(formErrors);
  };

  return (
    <>
      <Styled.sumWrapper>
        <SectionAccordion
          header={
            <Styled.sectionCustomHeader>
              <Text type="h2" headingStyle="titleLarge">
                Collections
              </Text>
              <Styled.badgeContainer>
                <Badge size="small" label="Collections" number={collectionsList.length} />
              </Styled.badgeContainer>
              {canAddCollection && (
                <Button
                  type="secondary"
                  label="Add Collection"
                  icon={Icons.Add}
                  iconAlignment="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAdd(true);
                  }}
                />
              )}
            </Styled.sectionCustomHeader>
          }
          isOpen={true}
        >
          <PlainTable
            headings={['Name', 'Last Edit', 'Items']}
            colWidths={[8, 2, 2]}
            rows={filteredCollectionsList.map(({ uuid, updatedAt, name, alertsCount }) => {
              const formattedDate = format(new Date(updatedAt), DateFormat.API);
              return [
                accountId,
                <Text key={uuid}>
                  <Link href={`/collections/${uuid}`}>
                    <a>{name}</a>
                  </Link>
                </Text>,
                <Text key={uuid}>{formattedDate}</Text>,
                <Styled.itemsCol key={uuid}>
                  <Badge size="small" label="Alerts" number={alertsCount} />
                  <IconButton
                    onClick={() => router.push(`/collections/${uuid}`)}
                    icon={Icons.ChevronRightBold}
                    type="text"
                    isSmall
                  />
                </Styled.itemsCol>,
              ];
            })}
          />
          <Styled.sumUserNav>
            <PaginationStats />
            <PaginationButtons />
          </Styled.sumUserNav>
          <Spacer size={5} />
        </SectionAccordion>
      </Styled.sumWrapper>
      {showAdd && (
        <Modal
          size="large"
          title="Create New Collection"
          titleAside={
            <>
              <Text type="labelSmall">Created by:</Text> <Avatar type="consultant" size="small" />
              <Text type="labelSmall" bold>
                {user.displayName}
              </Text>
            </>
          }
          onClose={cancelCreateCollection}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Cancel',
              onClick: cancelCreateCollection,
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Create Collection',
              icon: Icons.Tick,
              disabled: !isComplete,
              onClick: createCollection,
            },
          ]}
          buttonAlignment="right"
          bodyOverflow
        >
          <Styled.addCollectionContent stacked={!user?.isDodsUser}>
            <InputText
              id="new-collection-title"
              required
              label="Collection title"
              placeholder="Type a collection title"
              value={addTitle}
              onChange={setAddTitle}
              error={errors.title}
              onBlur={() => validateField('title', 'Collection title', addTitle)}
            />

            {user?.isDodsUser && (
              <SearchDropdown
                isFilter
                id="account"
                testId={'account'}
                value={addAccount}
                values={accounts}
                placeholder="Pick an account"
                onChange={(value: string) => {
                  setAddAccount(value);
                  validateField('account', 'Account', value);
                }}
                required
                label="Account"
                error={errors.account}
                onBlur={() => validateField('account', 'Account', addAccount)}
                onKeyPress={(val, search?: string) => loadAccounts(setAccounts, search)}
                onKeyPressHasSearch
              />
            )}
          </Styled.addCollectionContent>
        </Modal>
      )}
    </>
  );
};

export default Collections;
