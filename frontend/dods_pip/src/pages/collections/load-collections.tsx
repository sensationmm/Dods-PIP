import { SelectProps } from '@dods-ui/components/_form/Select';
import fetchJson, { CustomResponse } from '@dods-ui/lib/fetchJson';
import { Api, BASE_URI } from '@dods-ui/utils/api';

import { Collection, Collections } from './index.page';

const loadCollections = async (
  setCollections: (collections: SelectProps['options']) => void,
  accountId?: string,
): Promise<void> => {
  try {
    let url;
    if (accountId) {
      url = `${BASE_URI}${Api.Collections}/${accountId}`;
    } else {
      url = `${BASE_URI}${Api.Collections}`;
    }
    const results = await fetchJson<CustomResponse>(url, {
      method: 'GET',
    });
    const { data = [] } = results;
    const result = (data as Collections).map((item: Collection) => ({
      value: item.uuid,
      label: item.name,
    }));

    setCollections(result);
  } catch (e) {
    setCollections([]);
  }
};

export default loadCollections;
