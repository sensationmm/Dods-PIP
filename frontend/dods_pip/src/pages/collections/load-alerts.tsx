import { SelectProps } from '@dods-ui/components/_form/Select';
import { AlertData } from '@dods-ui/components/Alert';
import fetchJson, { CustomResponse } from '@dods-ui/lib/fetchJson';
import { Api, BASE_URI } from '@dods-ui/utils/api';

const loadAlerts = async (
  setAlerts: (alerts: SelectProps['options']) => void,
  collectionId?: string,
): Promise<void> => {
  try {
    const url = `${BASE_URI}${Api.Collections}/${collectionId}${Api.Alerts}`;
    const results = await fetchJson<CustomResponse>(url, {
      method: 'GET',
    });
    const { alerts = [] } = results;
    const result = (alerts as AlertData[]).map((item: AlertData) => ({
      value: item.uuid,
      label: item.title,
    }));

    setAlerts(result);
  } catch (e) {
    setAlerts([]);
  }
};

export default loadAlerts;
