import fetchJson from '../../lib/fetchJson';
import withSession from '../../lib/session';
import { Api } from '../../utils/api';

export default withSession(async (req, res) => {
  const { method } = req;
  try {
    if (method === 'GET') {
      try {
        const response = await fetchJson(
          `${process.env.APP_API_URL}${Api.ContentSearch}/`,
          {
            method,
          },
          req,
        );

        res.json(response);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
    } else if (method === 'POST') {
      try {
        const response = await fetchJson(`${process.env.APP_API_URL}${Api.ContentSearch}`, {
          method,
          body: JSON.stringify(req.body),
        });

        res.json(response);
      } catch (error) {
        const { response: fetchResponse } = error;
        res.status(fetchResponse?.status || 500).json(error.data);
      }
    } else {
      res.status(403).json({ name: 'Forbidden', code: 403, message: 'Forbidden method' });
    }
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
