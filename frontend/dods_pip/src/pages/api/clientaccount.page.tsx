import fetchJson from '../../lib/fetchJson';
import withSession from '../../lib/session';
import { Api, toQueryString } from '../../utils/api';

export default withSession(async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    try {
      const queryString = toQueryString(req.query);
      const result = await fetchJson(
        `${process.env.APP_API_URL}${Api.ClientAccount}${queryString}`,
        {
          method,
        },
      );
      res.json(result);
    } catch (error) {
      const { response: fetchResponse } = error;
      res.status(fetchResponse?.status || 500).json(error.data);
    }
  } else if (method === 'POST') {
    try {
      const result = await fetchJson(
        `${process.env.APP_API_URL}${Api.ClientAccount}`,
        {
          method,
          body: JSON.stringify(req.body),
        },
        req,
      );
      res.json(result);
    } catch (error) {
      const { response: fetchResponse } = error;
      res.status(fetchResponse?.status || 500).json(error.data);
    }
  } else {
    res.status(403).json({ name: 'Forbidden', code: 403, message: 'Forbidden method' });
  }
});
