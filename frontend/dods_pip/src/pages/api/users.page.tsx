import fetchJson from '../../lib/fetchJson';
import withSession from '../../lib/session';
import { Api } from '../../utils/api';

export default withSession(async (req, res) => {
  try {
    const { query } = req;
    const { name } = query;
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.Users}${
        name ? '?name=' + name + '&role=83618280-9c84-441c-94d1-59e4b24cbe3d' : ''
      }`,
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
