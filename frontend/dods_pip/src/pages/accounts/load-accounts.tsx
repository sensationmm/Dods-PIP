import { SelectProps } from '@dods-ui/components/_form/Select';
import fetchJson, { CustomResponse } from '@dods-ui/lib/fetchJson';
import { Api, BASE_URI } from '@dods-ui/utils/api';

import { ClientAccount, ClientAccounts } from '../account-management/accounts.page';

const loadAccounts = async (
  setAccounts: (accounts: SelectProps['options']) => void,
  accountSearch?: string,
): Promise<void> => {
  try {
    let url;
    if (accountSearch) {
      url = `${BASE_URI}${Api.ClientAccount}?startsWith=${accountSearch}`;
    } else {
      url = `${BASE_URI}${Api.ClientAccount}`;
    }
    const results = await fetchJson<CustomResponse>(url, {
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

export default loadAccounts;
