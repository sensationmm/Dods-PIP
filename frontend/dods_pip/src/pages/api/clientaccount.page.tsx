import fetchJson from '../../lib/fetchJson';
import withSession from '../../lib/session';
import { Api, toQueryString } from '../../utils/api';

export default withSession(async (req, res) => {
  try {
    const queryString = toQueryString(req.query);
    const result = await fetchJson(`${process.env.APP_API_URL}${Api.ClientAccount}${queryString}`, {
      method: 'GET',
    });
    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
