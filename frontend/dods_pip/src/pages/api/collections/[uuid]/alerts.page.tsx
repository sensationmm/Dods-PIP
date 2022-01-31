import fetchJson from '../../../../lib/fetchJson';
import withSession from '../../../../lib/session';
import { Api, toQueryString } from '../../../../utils/api';

export default withSession(async (req, res) => {
  const { query, method, body } = req;
  const { uuid } = query;
  try {
    const queryString = toQueryString(req.query);
    let result;
    if (method === 'GET' || method === 'DELETE') {
      result = await fetchJson(
        `${process.env.APP_API_URL}${Api.Collections}/${uuid}/alerts${queryString}`,
        {
          method,
        },
        req,
      );
    } else {
      result = await fetchJson(
        `${process.env.APP_API_URL}${Api.Collections}/${uuid}/alerts`,
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
