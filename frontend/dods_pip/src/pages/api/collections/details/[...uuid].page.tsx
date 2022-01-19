import fetchJson from '../../../../lib/fetchJson';
import withSession from '../../../../lib/session';
import { Api } from '../../../../utils/api';

export default withSession(async (req, res) => {
  const { query, method } = req;
  const { uuid } = query;
  try {
    let result;
    if (method === 'GET' || method === 'DELETE') {
      result = await fetchJson(
        `${process.env.APP_API_URL}${Api.Collections}/${uuid}`,
        {
          method,
        },
        req,
      );
    } else {
      result = await fetchJson(
        `${process.env.APP_API_URL}${Api.Collections}/${uuid}`,
        {
          method,
          body: JSON.stringify(req.body),
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
