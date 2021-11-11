/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import fetchJson from '../lib/fetchJson';
import { Api, BASE_URI } from '../utils/api';

type SubscriptionType = {
  uuid: string;
  label: string; // same as name (for dropdown)
  name: string;
  value: string; // same as uuid (for dropdown)
};

type Error = {
  code?: string;
  message?: string;
};

type UseSubscriptionTypes = {
  subscriptionList: SubscriptionType[] | [];
  error?: Error;
};

type params = {
  placeholder: string;
};

export default function useSubscriptionTypes({ placeholder }: params): UseSubscriptionTypes {
  const [subscriptionList, setSubscriptionList] = useState<SubscriptionType[]>([]);
  const [error, setError] = useState<Error>({});

  const loadSubscriptionTypes = async () => {
    const option: SubscriptionType = {
      value: '',
      label: placeholder,
      name: placeholder,
      uuid: '',
    };
    let selectValues = [];

    try {
      const data = await fetchJson(`${BASE_URI}${Api.SubscriptionTypes}`, {
        method: 'GET',
      });

      if (Array.isArray(data)) {
        selectValues = data.map((item: SubscriptionType) => {
          const { uuid, name } = item;
          return {
            uuid,
            name,
            label: name,
            value: uuid,
          };
        });
        setSubscriptionList([option, ...selectValues]);
      }
    } catch ({ data = {} }) {
      setError(data as Error);
    }
  };

  useEffect(() => {
    loadSubscriptionTypes();
  }, []);

  return { subscriptionList, error };
}
