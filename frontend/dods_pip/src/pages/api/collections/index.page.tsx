import fetchJson from '../../../lib/fetchJson';
import withSession from '../../../lib/session';
import { Api, toQueryString } from '../../../utils/api';

export default withSession(async (req, res) => {
  const { query, method, body } = req;
  try {
    let result;
    if (method === 'GET' || method === 'DELETE') {
      result = await fetchJson(
        `${process.env.APP_API_URL}${Api.Collections}${toQueryString(query)}`,
        {
          method,
        },
        req,
      );
    } else {
      result = await fetchJson(
        `${process.env.APP_API_URL}${Api.Collections}${toQueryString(query)}`,
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
