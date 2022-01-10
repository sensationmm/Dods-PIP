import fetchJson from '../../../lib/fetchJson';
import withSession from '../../../lib/session';
import { Api, toQueryString } from '../../../utils/api';

export default withSession(async (req, res) => {
  const { uuid, ...rest } = req.query;
  try {
    const queryString = { clientAccountId: uuid[0], ...rest };
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.Collections}${toQueryString(queryString)}`,
      {
        method: 'GET',
      },
      req,
    );
    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
