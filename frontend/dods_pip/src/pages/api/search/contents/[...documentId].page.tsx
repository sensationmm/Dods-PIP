import { Api } from '@dods-ui/utils/api';

import fetchJson from '../../../../lib/fetchJson';
import withSession from '../../../../lib/session';

export default withSession(async (req, res) => {
  const { method } = req;
  const { documentId } = req.query;
  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}/${Api.Content}/${documentId}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      req,
    );
    res.json(result);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
