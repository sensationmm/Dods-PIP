import fetchJson from '../../../../../lib/fetchJson';
import withSession from '../../../../../lib/session';
import { Api } from '../../../../../utils/api';

export default withSession(async (req, res) => {
  const { query, method, body } = req;
  const { uuid, alertId } = query;
  try {
    const url = `${process.env.APP_API_URL}${Api.Collections}/${uuid}/alerts/${alertId}`;
    let result;
    if (method === 'GET' || method === 'DELETE') {
      result = await fetchJson(
        url,
        {
          method,
        },
        req,
      );
    } else {
      result = await fetchJson(
        url,
        {
          method,
          body: JSON.stringify(body),
        },
        req,
      );
    }

    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
