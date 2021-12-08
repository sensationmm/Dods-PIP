import fetchJson from '../../lib/fetchJson';
import withSession from '../../lib/session';
import { Api } from '../../utils/api';

export default withSession(async (req, res) => {
  try {
    const result = await fetchJson(
      `${process.env.APP_API_URL}${Api.SubscriptionTypes}`,
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
