import fetchJson from '../../../../lib/fetchJson';
import withSession from '../../../../lib/session';
import { Api } from '../../../../utils/api';

export default withSession(async (req, res) => {
  const { method, query } = req;
  const { uuid, slug } = query;
  const validSlugs = ['header', 'subscription', 'teammember'];

  if (!validSlugs.includes(slug[0])) {
    res.status(403).json({
      name: 'Forbidden',
      code: 403,
      message: `Incorrect slug for PUT client account. Correct slug values are ${validSlugs.join(
        ', ',
      )}`,
    });
  } else if (method === 'GET') {
    try {
      const response = await fetchJson(
        `${process.env.APP_API_URL}${Api.ClientAccount}/${uuid}/${slug[0]}`,
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
  } else if (method === 'PUT') {
    try {
      const response = await fetchJson(
        `${process.env.APP_API_URL}${Api.ClientAccount}/${uuid}/${slug[0]}`,
        {
          method,
          body: JSON.stringify(req.body),
        },
      );

      res.json(response);
    } catch (error) {
      const { response: fetchResponse } = error;
      res.status(fetchResponse?.status || 500).json(error.data);
    }
  } else {
    res.status(403).json({ name: 'Forbidden', code: 403, message: 'Forbidden method' });
  }
});
