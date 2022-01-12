import InputText from '@dods-ui/components/_form/InputText';
import SearchDropdown from '@dods-ui/components/_form/SearchDropdown';
import { SelectProps } from '@dods-ui/components/_form/Select';
import Avatar from '@dods-ui/components/Avatar';
import { Icons } from '@dods-ui/components/Icon/assets';
import Loader from '@dods-ui/components/Loader';
import Modal from '@dods-ui/components/Modal';
import Pagination, { PaginationType } from '@dods-ui/components/Pagination';
import Text from '@dods-ui/components/Text';
import fetchJson from '@dods-ui/lib/fetchJson';
import useDebounce from '@dods-ui/lib/useDebounce';
import useUser, { User } from '@dods-ui/lib/useUser';
import { Api, BASE_URI, toQueryString } from '@dods-ui/utils/api';
import React from 'react';

import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import { ClientAccount, ClientAccounts } from '../account-management/accounts.page';
import * as Styled from './collections.styles';
import CollectionsAdmin from './collections-admin';
import CollectionsUser from './collections-user';

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

export type FilterParams = {
  limit?: number;
  offset?: number;
  searchTerm?: string;
};

interface CollectionsProps extends LoadingHOCProps {}

export interface CollectionsScreenProps extends LoadingHOCProps {
  setShowAdd: (val: boolean) => void;
  user: User;
  collectionsList: Collections;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  total: number;
  PaginationButtons: PaginationType['PaginationButtons'];
  PaginationStats: PaginationType['PaginationStats'];
}

type Errors = {
  title?: string;
  account?: string;
};

type Filters = {
  search?: string;
};

export const Collections: React.FC<CollectionsProps> = ({
  isLoading,
  setLoading,
  addNotification,
}) => {
  const { user } = useUser({ redirectTo: '/' });
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [addTitle, setAddTitle] = React.useState<string>('');
  const [addAccount, setAddAccount] = React.useState<string>('');
  const [accounts, setAccounts] = React.useState<SelectProps['options']>([]);
  const [errors, setErrors] = React.useState<Errors>({});

  const [collectionsList, setCollectionsList] = React.useState<Collections>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [filters, setFilters] = React.useState<Filters>({});
  const debouncedValue = useDebounce<string>(filters.search as string, 850);

  const isComplete = addAccount !== '' && addTitle != '';

  const HOCProps = {
    isLoading,
    setLoading,
    addNotification,
  };

  const { activePage, numPerPage, PaginationButtons, PaginationStats } = Pagination(total, '10');

  const getFilterQueryString = () => {
    const params: FilterParams = {
      limit: numPerPage,
      offset: activePage * numPerPage,
      ...(filters?.search && { searchTerm: encodeURI(filters?.search) }),
    };

    return toQueryString(params);
  };

  const loadCollections = async () => {
    setLoading(true);
    const queryString = getFilterQueryString();
    try {
      const results = await fetchJson(
        `${BASE_URI}${Api.Collections}/${user.clientAccountId}${queryString}`,
        {
          method: 'GET',
        },
      );
      const { data = [], filteredRecords } = results;
      setCollectionsList(data as Collections);
      setTotal(filteredRecords as number);
    } catch (e) {
      setCollectionsList([] as Collections);
      setTotal(0);
    }

    setLoading(false);
  };

  const loadAccounts = async (accountSearch?: string) => {
    try {
      let url;
      if (accountSearch) {
        url = `${BASE_URI}${Api.ClientAccount}?startsWith=${accountSearch}`;
      } else {
        url = `${BASE_URI}${Api.ClientAccount}`;
      }
      const results = await fetchJson(url, {
        method: 'GET',
      });
      const { data = [] } = results;
      if (accountSearch) {
        const result = (data as ClientAccounts).map((item: ClientAccount) => ({
          value: item.uuid,
          label: item.name,
        }));

        setAccounts(result);
      } else {
        const result = {
          value: (data as ClientAccount).uuid,
          label: (data as ClientAccount).name,
        };
        setAccounts([result]);
      }
    } catch (e) {
      setAccounts([]);
    }
  };

  const createCollection = async () => {
    setLoading(true);
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
      setLoading(false);
    } catch {
      console.log('FAIL createCollection');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user?.clientAccountId) {
      if (user?.isDodsUser) {
        loadAccounts();
      } else {
        setAddAccount(user.clientAccountId);
      }
    }
  }, [user]);

  React.useEffect(() => {
    (async () => {
      await loadCollections();
    })();
  }, [debouncedValue, numPerPage, activePage, user]);

  if (!user) {
    return <Loader data-test="loader" inline />;
  }

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
      {user && user.isDodsUser && (
        <CollectionsAdmin
          user={user}
          {...HOCProps}
          setShowAdd={setShowAdd}
          collectionsList={collectionsList}
          filters={filters}
          setFilters={setFilters}
          total={total}
          PaginationButtons={PaginationButtons}
          PaginationStats={PaginationStats}
        />
      )}

      {user && !user.isDodsUser && (
        <CollectionsUser
          user={user}
          {...HOCProps}
          setShowAdd={setShowAdd}
          collectionsList={collectionsList}
          filters={filters}
          setFilters={setFilters}
          total={total}
          PaginationButtons={PaginationButtons}
          PaginationStats={PaginationStats}
        />
      )}

      {showAdd && (
        <Modal
          size="large"
          title="Create New Collection"
          titleAside={
            <>
              <Text type="labelSmall">Created by:</Text>{' '}
              <Avatar type={user?.isDodsUser ? 'consultant' : 'client'} size="small" />
              <Text type="labelSmall" bold>
                {user.displayName}
              </Text>
            </>
          }
          onClose={() => setShowAdd(false)}
          buttons={[
            { isSmall: true, type: 'secondary', label: 'Cancel' },
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
                onKeyPress={(val, search?: string) => loadAccounts(search)}
                onKeyPressHasSearch
              />
            )}
          </Styled.addCollectionContent>
        </Modal>
      )}
    </>
  );
};

export default LoadingHOC(Collections);
