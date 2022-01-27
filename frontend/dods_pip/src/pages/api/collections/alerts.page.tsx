import fetchJson from '../../../lib/fetchJson';
import withSession from '../../../lib/session';
import { Api } from '../../../utils/api';

export default withSession(async (req, res) => {
  const { collectionId } = req.query;
  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.Collections}/${collectionId}/alerts`,
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
